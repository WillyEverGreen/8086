import { useState, useCallback } from 'react';
import { ProcessorState, Instruction, ExecutionStep } from '../types/processor';
import { parseInstruction, formatHex, clampToWord } from '../utils/instructionParser';
import { calculateFlags, shouldUpdateFlags, testFlagCalculation, computeFlagsWithOperands } from '../utils/flagCalculator';
import { ProcessorAnimations } from '../utils/animations';

// Test flag calculation on startup
testFlagCalculation();

const initialState: ProcessorState = {
  registers: {
    AX: { name: 'AX', value: 0, displayValue: '000H' },
    BX: { name: 'BX', value: 0, displayValue: '000H' },
    CX: { name: 'CX', value: 0, displayValue: '000H' },
    DX: { name: 'DX', value: 0, displayValue: '000H' }
  },
  flags: {
    ZF: false,
    CF: false,
    SF: false,
    OF: false
  },
  currentInstruction: '',
  isExecuting: false,
  currentStep: 0,
  instructionList: [],
  currentInstructionIndex: -1,
  executionLog: [],
  isStepMode: false
};

export function useProcessor() {
  const [state, setState] = useState<ProcessorState>(initialState);
  const [currentStep, setCurrentStep] = useState<ExecutionStep>('idle');

  const updateRegister = useCallback(async (regName: string, value: number) => {
    const clampedValue = clampToWord(value);
    const displayValue = formatHex(clampedValue);
    
    setState(prev => ({
      ...prev,
      registers: {
        ...prev.registers,
        [regName]: {
          ...prev.registers[regName as keyof typeof prev.registers],
          value: clampedValue,
          displayValue
        }
      }
    }));

    await ProcessorAnimations.animateRegisterUpdate(regName, displayValue);
  }, []);

  const setRegisterValues = useCallback((registers: { AX: number; BX: number; CX: number; DX: number }) => {
    setState(prev => ({
      ...prev,
      registers: {
        AX: { name: 'AX', value: registers.AX, displayValue: formatHex(registers.AX) },
        BX: { name: 'BX', value: registers.BX, displayValue: formatHex(registers.BX) },
        CX: { name: 'CX', value: registers.CX, displayValue: formatHex(registers.CX) },
        DX: { name: 'DX', value: registers.DX, displayValue: formatHex(registers.DX) }
      }
    }));
  }, []);

  const updateFlags = useCallback(async (newFlags: typeof state.flags) => {
    setState(prev => ({ ...prev, flags: newFlags }));
    
    // Animate each flag change
    const flagAnimations = Object.entries(newFlags).map(([flagName, isActive]) =>
      ProcessorAnimations.animateFlagUpdate(flagName, isActive)
    );
    
    await Promise.all(flagAnimations);
  }, []);

  const addToLog = useCallback((message: string) => {
    setState(prev => ({
      ...prev,
      executionLog: [...prev.executionLog, message]
    }));
  }, []);

  const executeInstruction = useCallback(async (instruction: Instruction) => {
    setState(prev => ({ ...prev, isExecuting: true }));
    
    try {
      // Step 1: Fetch
      setCurrentStep('fetch');
      await ProcessorAnimations.highlightInstruction();
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 2: Decode
      setCurrentStep('decode');
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 3: Execute
      setCurrentStep('execute');
      await ProcessorAnimations.animateALU(instruction.operation);

      let result = 0;
      let originalResult = 0;
      let targetRegister = '';
      let logMessage = '';

      switch (instruction.operation) {
        case 'ADD':
          if (instruction.destination && (instruction.source || instruction.immediate !== undefined)) {
            const destValue = state.registers[instruction.destination as keyof typeof state.registers].value;
            const srcValue = instruction.source 
              ? state.registers[instruction.source as keyof typeof state.registers].value 
              : (instruction.immediate ?? 0);
            
            originalResult = destValue + srcValue;
            result = clampToWord(originalResult);
            targetRegister = instruction.destination;
            logMessage = `ADD ${instruction.destination}, ${instruction.source || instruction.immediate} → ${instruction.destination} = ${formatHex(result)}`;
            
            if (instruction.source) {
              await ProcessorAnimations.animateValueTransfer(
                formatHex(srcValue),
                `[data-register="${instruction.source}"]`,
                '[data-alu="true"]'
              );
            }
            await ProcessorAnimations.animateValueTransfer(
              formatHex(destValue),
              `[data-register="${instruction.destination}"]`,
              '[data-alu="true"]'
            );
          }
          break;

        case 'SUB':
          if (instruction.destination && (instruction.source || instruction.immediate !== undefined)) {
            const destValue = state.registers[instruction.destination as keyof typeof state.registers].value;
            const srcValue = instruction.source 
              ? state.registers[instruction.source as keyof typeof state.registers].value 
              : (instruction.immediate ?? 0);
            
            originalResult = destValue - srcValue;
            result = clampToWord(originalResult);
            targetRegister = instruction.destination;
            logMessage = `SUB ${instruction.destination}, ${instruction.source || instruction.immediate} → ${instruction.destination} = ${formatHex(result)}`;
            
            if (instruction.source) {
              await ProcessorAnimations.animateValueTransfer(
                formatHex(srcValue),
                `[data-register="${instruction.source}"]`,
                '[data-alu="true"]'
              );
            }
            await ProcessorAnimations.animateValueTransfer(
              formatHex(destValue),
              `[data-register="${instruction.destination}"]`,
              '[data-alu="true"]'
            );
          }
          break;

        case 'MUL':
          if (instruction.source) {
            const axValue = state.registers.AX.value;
            const srcValue = state.registers[instruction.source as keyof typeof state.registers].value;
            
            originalResult = axValue * srcValue;
            result = clampToWord(originalResult);
            targetRegister = 'AX';
            logMessage = `MUL ${instruction.source} → AX = ${formatHex(result)}`;
            
            // Handle overflow to DX for MUL
            if (originalResult > 65535) {
              const dxValue = Math.floor(originalResult / 65536);
              await updateRegister('DX', dxValue);
              logMessage += `, DX = ${formatHex(dxValue)}`;
            }
            
            await ProcessorAnimations.animateValueTransfer(
              formatHex(axValue),
              '[data-register="AX"]',
              '[data-alu="true"]'
            );
            await ProcessorAnimations.animateValueTransfer(
              formatHex(srcValue),
              `[data-register="${instruction.source}"]`,
              '[data-alu="true"]'
            );
          }
          break;

        case 'DIV':
          if (instruction.source) {
            const axValue = state.registers.AX.value;
            const srcValue = state.registers[instruction.source as keyof typeof state.registers].value;
            
            if (srcValue === 0) {
              alert('Division by zero error!');
              addToLog(`DIV ${instruction.source} → ERROR: Division by zero`);
              return;
            }
            
            originalResult = Math.floor(axValue / srcValue);
            const remainder = axValue % srcValue;
            result = clampToWord(originalResult);
            targetRegister = 'AX';
            logMessage = `DIV ${instruction.source} → AX = ${formatHex(result)}, DX = ${formatHex(remainder)}`;
            
            // Store remainder in DX
            await updateRegister('DX', remainder);
            
            await ProcessorAnimations.animateValueTransfer(
              formatHex(axValue),
              '[data-register="AX"]',
              '[data-alu="true"]'
            );
            await ProcessorAnimations.animateValueTransfer(
              formatHex(srcValue),
              `[data-register="${instruction.source}"]`,
              '[data-alu="true"]'
            );
          }
          break;

        case 'MOV':
          if (instruction.destination && (instruction.source || instruction.immediate !== undefined)) {
            result = instruction.source 
              ? state.registers[instruction.source as keyof typeof state.registers].value 
              : (instruction.immediate ?? 0);
            originalResult = result;
            targetRegister = instruction.destination;
            logMessage = `MOV ${instruction.destination}, ${instruction.source || instruction.immediate} → ${instruction.destination} = ${formatHex(result)}`;
            
            if (instruction.source) {
              await ProcessorAnimations.animateValueTransfer(
                formatHex(result),
                `[data-register="${instruction.source}"]`,
                `[data-register="${instruction.destination}"]`
              );
            } else {
              // Animate immediate value
              await ProcessorAnimations.animateValueTransfer(
                formatHex(result),
                '[data-instruction="true"]',
                `[data-register="${instruction.destination}"]`
              );
            }
          }
          break;
      }

      // Step 4: Writeback
      setCurrentStep('writeback');
      await new Promise(resolve => setTimeout(resolve, 300));

      if (targetRegister) {
        await updateRegister(targetRegister, result);
        
                 if (shouldUpdateFlags(instruction.operation)) {
           // Use proper 8086 flag calculation with operands
           const size = (instruction.operation === 'ADD' || instruction.operation === 'SUB') ? 8 : 16;
           
           // Get the actual operands
           const operand1 = instruction.destination 
             ? state.registers[instruction.destination as keyof typeof state.registers].value 
             : 0;
           const operand2 = instruction.source 
             ? state.registers[instruction.source as keyof typeof state.registers].value 
             : (instruction.immediate ?? 0);
           
           console.log('Flag calculation debug:', {
             operation: instruction.operation,
             operand1,
             operand2,
             rawResult: originalResult,
             size
           });
           
           const flagResult = computeFlagsWithOperands({
             op: instruction.operation,
             operand1,
             operand2,
             rawResult: originalResult,
             size
           });
           
           console.log('Flag result:', flagResult);
           
           await updateFlags({
             ZF: flagResult.ZF,
             CF: flagResult.CF,
             SF: flagResult.SF,
             OF: flagResult.OF
           });
         }
        
        if (instruction.operation !== 'MOV') {
          await ProcessorAnimations.animateValueTransfer(
            formatHex(result),
            '[data-alu="true"]',
            `[data-register="${targetRegister}"]`
          );
        }
        
        if (logMessage) {
          addToLog(logMessage);
        }
      }

    } catch (error) {
      console.error('Execution error:', error);
      addToLog(`ERROR: ${error}`);
    } finally {
      setCurrentStep('idle');
      setState(prev => ({ ...prev, isExecuting: false }));
    }
  }, [state.registers, updateRegister, updateFlags, addToLog]);

  const runInstruction = useCallback(async (input: string) => {
    const instruction = parseInstruction(input);
    if (!instruction) {
      alert('Invalid instruction format!');
      return;
    }

    setState(prev => ({ ...prev, currentInstruction: input }));
    await executeInstruction(instruction);
  }, [executeInstruction]);

  const setInstructionList = useCallback((instructions: string[]) => {
    setState(prev => ({
      ...prev,
      instructionList: instructions,
      currentInstructionIndex: -1
    }));
  }, []);

  const runAllInstructions = useCallback(async () => {
    if (state.instructionList.length === 0) return;
    
    setState(prev => ({ ...prev, currentInstructionIndex: 0 }));
    
    for (let i = 0; i < state.instructionList.length; i++) {
      setState(prev => ({ ...prev, currentInstructionIndex: i }));
      await runInstruction(state.instructionList[i]);
      await new Promise(resolve => setTimeout(resolve, 500)); // Pause between instructions
    }
    
    setState(prev => ({ ...prev, currentInstructionIndex: state.instructionList.length }));
  }, [state.instructionList, runInstruction]);

  const stepNextInstruction = useCallback(async () => {
    const nextIndex = state.currentInstructionIndex + 1;
    if (nextIndex < state.instructionList.length) {
      setState(prev => ({ ...prev, currentInstructionIndex: nextIndex }));
      await runInstruction(state.instructionList[nextIndex]);
    }
  }, [state.currentInstructionIndex, state.instructionList, runInstruction]);

  const toggleStepMode = useCallback(() => {
    setState(prev => ({ ...prev, isStepMode: !prev.isStepMode }));
  }, []);

  const clearExecutionLog = useCallback(() => {
    setState(prev => ({ ...prev, executionLog: [] }));
  }, []);
  const resetProcessor = useCallback(() => {
    setState(initialState);
    setCurrentStep('idle');
    ProcessorAnimations.cleanup();
  }, []);

  return {
    state,
    currentStep,
    runInstruction,
    setRegisterValues,
    setInstructionList,
    runAllInstructions,
    stepNextInstruction,
    toggleStepMode,
    clearExecutionLog,
    resetProcessor
  };
}