import React from 'react';
import { ExecutionStep } from '../types/processor';
import { Cpu, HardDrive, Database, FileText, ArrowRight, ArrowUp } from 'lucide-react';

interface ALUPanelProps {
  currentStep: ExecutionStep;
  isExecuting: boolean;
  currentInstruction: string;
  onNextStep?: () => void;
  isStepMode?: boolean;
  canProceed?: boolean;
  registers?: any;
  operand1?: string;
  operand2?: string;
  result?: string;
}

export function ALUPanel({ 
  currentStep, 
  isExecuting, 
  currentInstruction, 
  onNextStep,
  isStepMode = false,
  canProceed = false,
  registers,
  operand1 = '?',
  operand2 = '?',
  result = '?'
}: ALUPanelProps) {
  const getALUStatus = () => {
    if (!isExecuting) return 'Idle';
    
    switch (currentStep) {
      case 'fetch': return 'Fetching Instruction...';
      case 'decode': return 'Decoding Instruction...';
      case 'execute': return 'Executing Operation...';
      case 'writeback': return 'Writing Back Result...';
      default: return 'Ready';
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 'fetch': return 'Reading instruction from memory and loading into instruction register';
      case 'decode': return 'Analyzing instruction and preparing control signals';
      case 'execute': return 'Performing arithmetic/logic operation in ALU';
      case 'writeback': return 'Storing result back to register file';
      default: return '';
    }
  };

  const getStepNumber = () => {
    const steps = ['fetch', 'decode', 'execute', 'writeback'];
    return steps.indexOf(currentStep) + 1;
  };

  const isActive = isExecuting && currentStep === 'execute';
  const isFetchActive = isExecuting && currentStep === 'fetch';
  const isDecodeActive = isExecuting && currentStep === 'decode';
  const isWritebackActive = isExecuting && currentStep === 'writeback';

  return (
    <div className="bg-gray-900 rounded-lg p-4 shadow-lg border border-gray-700">
      <h2 className="text-lg font-bold text-white mb-3 flex items-center">
        <div className="w-2 h-2 bg-orange-400 rounded-full mr-2 animate-pulse"></div>
        Processor Architecture
      </h2>
      
      <div className="space-y-4">
        {/* Step Mode Header */}
        {isStepMode && isExecuting && (
          <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <div className="text-blue-300 font-semibold text-sm">Step {getStepNumber()}/4: {currentStep.toUpperCase()}</div>
            </div>
            <div className="text-blue-200 text-xs">{getStepDescription()}</div>
          </div>
        )}

        {/* Compact Circuit Layout */}
        <div className="grid grid-cols-7 gap-3 items-center">
          {/* Memory */}
          <div className="text-center">
            <div className="text-xs text-gray-400 mb-1">Memory</div>
            <div
              data-memory="true"
              className={`relative w-14 h-14 rounded-lg border-2 transition-all duration-500 flex items-center justify-center ${
                isFetchActive
                  ? 'bg-purple-600 border-purple-400 shadow-lg shadow-purple-500/50'
                  : 'bg-gray-700 border-gray-600'
              }`}
            >
              <HardDrive className={`w-5 h-5 transition-colors ${
                isFetchActive ? 'text-white' : 'text-gray-400'
              }`} />
            </div>
          </div>

          <ArrowRight className="w-5 h-5 text-gray-500" />

          {/* Instruction Register */}
          <div className="text-center">
            <div className="text-xs text-gray-400 mb-1">IR</div>
            <div
              data-instruction-register="true"
              className={`relative w-20 h-12 rounded-lg border-2 transition-all duration-500 flex items-center justify-center ${
                isDecodeActive
                  ? 'bg-yellow-600 border-yellow-400 shadow-lg shadow-yellow-500/50'
                  : 'bg-gray-700 border-gray-600'
              }`}
            >
              <FileText className={`w-4 h-4 transition-colors ${
                isDecodeActive ? 'text-white' : 'text-gray-400'
              }`} />
            </div>
            {currentInstruction && (
              <div className="text-xs text-gray-300 font-mono mt-1 truncate max-w-20">
                {currentInstruction}
              </div>
            )}
          </div>

          <ArrowRight className="w-5 h-5 text-gray-500" />

          {/* Control Unit */}
          <div className="text-center">
            <div className="text-xs text-gray-400 mb-1">CU</div>
            <div
              data-control-unit="true"
              className={`relative w-14 h-14 rounded-lg border-2 transition-all duration-500 flex items-center justify-center ${
                isDecodeActive
                  ? 'bg-green-600 border-green-400 shadow-lg shadow-green-500/50'
                  : 'bg-gray-700 border-gray-600'
              }`}
            >
              <Database className={`w-5 h-5 transition-colors ${
                isDecodeActive ? 'text-white' : 'text-gray-400'
              }`} />
            </div>
          </div>
        </div>

        {/* ALU Row */}
        <div className="grid grid-cols-7 gap-3 items-center">
          {/* Operand 1 */}
          <div className="text-center">
            <div className="text-xs text-gray-400 mb-1">Op1</div>
            <div className="bg-gray-800 rounded-lg p-2 border border-gray-700">
              <div className="w-10 h-10 bg-gray-700 rounded flex items-center justify-center">
                <span className="text-gray-300 font-mono text-sm">{operand1}</span>
              </div>
            </div>
          </div>

          <ArrowRight className="w-5 h-5 text-gray-500" />

          {/* ALU Core */}
          <div className="text-center">
            <div className="text-xs text-gray-400 mb-1">ALU</div>
            <div
              data-alu="true"
              className={`relative w-20 h-20 rounded-lg border-2 transition-all duration-500 flex items-center justify-center ${
                isActive
                  ? 'bg-blue-600 border-blue-400 shadow-lg shadow-blue-500/50'
                  : 'bg-gray-700 border-gray-600'
              }`}
            >
              <Cpu className={`w-8 h-8 transition-colors ${
                isActive ? 'text-white' : 'text-gray-400'
              }`} />
              <div
                data-alu-operation="true"
                className="absolute -bottom-6 text-xs font-mono text-center w-full opacity-0"
              />
            </div>
          </div>

          <ArrowRight className="w-5 h-5 text-gray-500" />

          {/* Operand 2 */}
          <div className="text-center">
            <div className="text-xs text-gray-400 mb-1">Op2</div>
            <div className="bg-gray-800 rounded-lg p-2 border border-gray-700">
              <div className="w-10 h-10 bg-gray-700 rounded flex items-center justify-center">
                <span className="text-gray-300 font-mono text-sm">{operand2}</span>
              </div>
            </div>
          </div>

          <ArrowRight className="w-5 h-5 text-gray-500" />

          {/* Result */}
          <div className="text-center">
            <div className="text-xs text-gray-400 mb-1">Result</div>
            <div className="bg-gray-800 rounded-lg p-2 border border-gray-700">
              <div className="w-10 h-10 bg-gray-700 rounded flex items-center justify-center">
                <span className="text-gray-300 font-mono text-sm">{result}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Register Bank Row */}
        <div className="grid grid-cols-7 gap-3 items-center">
          {/* Register Bank */}
          <div className="text-center col-span-7">
            <div className="text-xs text-gray-400 mb-1">Register Bank</div>
            <div
              data-register-bank="true"
              className={`relative w-full h-12 rounded-lg border-2 transition-all duration-500 flex items-center justify-center ${
                isWritebackActive
                  ? 'bg-red-600 border-red-400 shadow-lg shadow-red-500/50'
                  : 'bg-gray-700 border-gray-600'
              }`}
            >
              <div className="grid grid-cols-4 gap-4 w-full px-4">
                {registers && Object.entries(registers).map(([name, reg]: [string, any]) => (
                  <div key={name} className="text-center">
                    <div className="text-xs text-gray-300 font-mono font-bold">{name}</div>
                    <div className="text-xs text-gray-400 font-mono">{reg.displayValue}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Status and Controls */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="text-xs text-gray-400 mb-1">Status:</div>
            <div className={`text-sm font-semibold ${
              isExecuting ? 'text-blue-400' : 'text-gray-300'
            }`}>
              {getALUStatus()}
            </div>
          </div>

          {/* Pipeline Progress */}
          <div className="flex-1">
            <div className="text-xs text-gray-400 mb-1">Pipeline:</div>
            <div className="flex space-x-1">
              {(['fetch', 'decode', 'execute', 'writeback'] as ExecutionStep[]).map((step, index) => (
                <div
                  key={step}
                  className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                    currentStep === step && isExecuting
                      ? 'bg-blue-500 shadow-lg shadow-blue-500/50'
                      : 'bg-gray-700'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Step Mode Controls */}
          {isStepMode && isExecuting && (
            <div className="flex-1">
              <button
                onClick={onNextStep}
                disabled={!canProceed}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-3 py-2 rounded-lg font-semibold text-sm transition-all"
              >
                Next Step
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}