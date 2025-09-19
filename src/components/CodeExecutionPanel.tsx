import React, { useState } from 'react';
import { ExecutionStep } from '../types/processor';
import { Play, SkipForward, RotateCcw, Zap } from 'lucide-react';

interface CodeExecutionPanelProps {
  onRunInstruction: (instruction: string) => void;
  onReset: () => void;
  currentInstruction: string;
  currentStep: ExecutionStep;
  isExecuting: boolean;
}

export function CodeExecutionPanel({
  onRunInstruction,
  onReset,
  currentInstruction,
  currentStep,
  isExecuting
}: CodeExecutionPanelProps) {
  const [instruction, setInstruction] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (instruction.trim() && !isExecuting) {
      onRunInstruction(instruction.trim());
    }
  };

  const getStepDescription = (step: ExecutionStep) => {
    switch (step) {
      case 'fetch': return 'Fetching instruction from memory...';
      case 'decode': return 'Decoding instruction operands...';
      case 'execute': return 'Executing operation in ALU...';
      case 'writeback': return 'Writing results to registers...';
      default: return 'Ready to execute next instruction';
    }
  };

  const predefinedInstructions = [
    'ADD AX, BX',
    'SUB AX, 10',
    'MUL CX',
    'DIV BX',
    'MOV BX, 255'
  ];

  return (
    <div className="bg-gray-900 rounded-lg p-6 shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center">
        <div className="w-3 h-3 bg-purple-400 rounded-full mr-2 animate-pulse"></div>
        Code Execution
      </h2>
      
      {/* Current Instruction Display */}
      {currentInstruction && (
        <div className="mb-4">
          <div className="text-sm text-gray-400 mb-2">Current Instruction:</div>
          <div
            data-instruction="true"
            className="bg-gray-800 border-2 border-gray-700 rounded-lg p-3 font-mono text-cyan-400 text-lg"
          >
            {currentInstruction}
          </div>
        </div>
      )}

      {/* Execution Status */}
      <div className="mb-4">
        <div className="text-sm text-gray-400 mb-2">Execution Status:</div>
        <div className={`p-3 rounded-lg flex items-center space-x-2 ${
          isExecuting ? 'bg-blue-900/30 border border-blue-500/30' : 'bg-gray-800'
        }`}>
          {isExecuting && <Zap className="w-4 h-4 text-blue-400 animate-pulse" />}
          <span className="text-sm text-white">
            {getStepDescription(currentStep)}
          </span>
        </div>
      </div>

      {/* Instruction Input */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="text-sm text-gray-400 mb-2">Enter Instruction:</div>
        <div className="flex space-x-2">
          <input
            type="text"
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            placeholder="e.g., ADD AX, BX"
            disabled={isExecuting}
            className="flex-1 bg-gray-800 border-2 border-gray-700 rounded-lg px-4 py-3 text-white font-mono focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          />
          <button
            type="submit"
            disabled={isExecuting || !instruction.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-all transform hover:scale-105 disabled:transform-none"
          >
            <Play className="w-4 h-4" />
            <span>Run</span>
          </button>
        </div>
      </form>

      {/* Quick Instructions */}
      <div className="mb-4">
        <div className="text-sm text-gray-400 mb-2">Quick Instructions:</div>
        <div className="flex flex-wrap gap-2">
          {predefinedInstructions.map((instr) => (
            <button
              key={instr}
              onClick={() => setInstruction(instr)}
              disabled={isExecuting}
              className="bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-300 px-3 py-2 rounded-md text-sm font-mono transition-colors"
            >
              {instr}
            </button>
          ))}
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex space-x-2">
        <button
          onClick={onReset}
          disabled={isExecuting}
          className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </button>
      </div>

      {/* Instruction Help */}
      <div className="mt-4 p-3 bg-gray-800 rounded-lg">
        <div className="text-sm text-gray-400 mb-2">Supported Instructions:</div>
        <div className="text-xs text-gray-500 space-y-1">
          <div><span className="font-mono text-cyan-400">ADD dest, src</span> - Add source to destination</div>
          <div><span className="font-mono text-cyan-400">SUB dest, src</span> - Subtract source from destination</div>
          <div><span className="font-mono text-cyan-400">MUL src</span> - Multiply AX by source</div>
          <div><span className="font-mono text-cyan-400">DIV src</span> - Divide AX by source</div>
          <div><span className="font-mono text-cyan-400">MOV dest, src</span> - Move source to destination</div>
        </div>
      </div>
    </div>
  );
}