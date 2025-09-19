import React from 'react';
import { useProcessor } from './hooks/useProcessor';
import { Header } from './components/Header';
import { RegisterPanel } from './components/RegisterPanel';
import { FlagsPanel } from './components/FlagsPanel';
import { CodeExecutionPanel } from './components/CodeExecutionPanel';
import { ALUPanel } from './components/ALUPanel';
import { InstructionListPanel } from './components/InstructionListPanel';
import { RegisterInitPanel } from './components/RegisterInitPanel';
import { ExecutionLogPanel } from './components/ExecutionLogPanel';

function App() {
  const {
    state,
    currentStep,
    runInstruction,
    setRegisterValues,
    setInstructionList,
    runAllInstructions,
    stepNextInstruction,
    toggleStepMode,
    clearExecutionLog,
    resetProcessor,
    nextPipelineStep,
    canProceed,
    operand1,
    operand2,
    result
  } = useProcessor();

  return (
    <div className="min-h-screen bg-gray-950">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Top Row - Register Init and Instruction List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <RegisterInitPanel
            onSetRegisters={setRegisterValues}
            currentValues={{
              AX: state.registers.AX.value,
              BX: state.registers.BX.value,
              CX: state.registers.CX.value,
              DX: state.registers.DX.value
            }}
            disabled={state.isExecuting}
          />
          <InstructionListPanel
            instructions={state.instructionList}
            currentIndex={state.currentInstructionIndex}
            onInstructionsChange={setInstructionList}
            onRunAll={runAllInstructions}
            onStepNext={stepNextInstruction}
            isExecuting={state.isExecuting}
            isStepMode={state.isStepMode}
            onToggleStepMode={toggleStepMode}
          />
        </div>
        
        {/* Second Row - Registers and Flags */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <RegisterPanel registers={state.registers} />
          <FlagsPanel flags={state.flags} />
        </div>
        
        {/* Third Row - ALU Visualization */}
        <div className="mb-4">
          <ALUPanel
            currentStep={currentStep}
            isExecuting={state.isExecuting}
            currentInstruction={state.currentInstruction}
            onNextStep={nextPipelineStep}
            isStepMode={state.isStepMode}
            canProceed={canProceed}
            registers={state.registers}
            operand1={operand1}
            operand2={operand2}
            result={result}
          />
        </div>
        
        {/* Bottom Row - Code Execution and Log */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <CodeExecutionPanel
            onRunInstruction={runInstruction}
            onReset={resetProcessor}
            currentInstruction={state.currentInstruction}
            currentStep={currentStep}
            isExecuting={state.isExecuting}
          />
          <ExecutionLogPanel
            log={state.executionLog}
            onClearLog={clearExecutionLog}
          />
        </div>
        
        {/* Footer */}
        <footer className="mt-8 pt-6 border-t border-gray-800 text-center text-gray-500">
          <p className="text-sm">
            Interactive 8086 microprocessor simulator with step-by-step execution and real-time visualization
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;