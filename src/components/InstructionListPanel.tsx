import React, { useState } from 'react';
import { FileText, Plus, Trash2, Play, Pause } from 'lucide-react';

interface InstructionListPanelProps {
  instructions: string[];
  currentIndex: number;
  onInstructionsChange: (instructions: string[]) => void;
  onRunAll: () => void;
  onStepNext: () => void;
  isExecuting: boolean;
  isStepMode: boolean;
  onToggleStepMode: () => void;
}

export function InstructionListPanel({
  instructions,
  currentIndex,
  onInstructionsChange,
  onRunAll,
  onStepNext,
  isExecuting,
  isStepMode,
  onToggleStepMode
}: InstructionListPanelProps) {
  const [newInstruction, setNewInstruction] = useState('');

  const addInstruction = () => {
    if (newInstruction.trim()) {
      onInstructionsChange([...instructions, newInstruction.trim()]);
      setNewInstruction('');
    }
  };

  const removeInstruction = (index: number) => {
    const updated = instructions.filter((_, i) => i !== index);
    onInstructionsChange(updated);
  };

  const updateInstruction = (index: number, value: string) => {
    const updated = [...instructions];
    updated[index] = value;
    onInstructionsChange(updated);
  };

  const predefinedPrograms = [
    {
      name: 'Basic Arithmetic',
      instructions: [
        'MOV AX, 10',
        'MOV BX, 5',
        'ADD AX, BX',
        'SUB AX, 3',
        'MUL BX'
      ]
    },
    {
      name: 'Division Example',
      instructions: [
        'MOV AX, 20',
        'MOV BX, 4',
        'DIV BX',
        'MOV CX, AX'
      ]
    },
    {
      name: 'Register Transfer',
      instructions: [
        'MOV AX, 255',
        'MOV BX, AX',
        'MOV CX, BX',
        'MOV DX, CX'
      ]
    }
  ];

  const loadProgram = (program: typeof predefinedPrograms[0]) => {
    onInstructionsChange(program.instructions);
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center">
        <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2 animate-pulse"></div>
        Instruction List
      </h2>

      {/* Control Buttons */}
      <div className="flex space-x-2 mb-4">
        <button
          onClick={onToggleStepMode}
          className={`px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 transition-all ${
            isStepMode
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
          }`}
        >
          {isStepMode ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span>{isStepMode ? 'Step Mode' : 'Run Mode'}</span>
        </button>
        
        {isStepMode && isExecuting && (
          <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg px-3 py-2">
            <div className="text-xs text-blue-300 font-semibold">Step Mode Active</div>
            <div className="text-xs text-blue-400">Press "Next Step" in ALU panel</div>
          </div>
        )}
        
        {isStepMode ? (
          <button
            onClick={onStepNext}
            disabled={isExecuting || currentIndex >= instructions.length}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 transition-all"
          >
            <span>Next Instruction</span>
          </button>
        ) : (
          <button
            onClick={onRunAll}
            disabled={isExecuting || instructions.length === 0}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 transition-all"
          >
            <Play className="w-4 h-4" />
            <span>Run All</span>
          </button>
        )}
      </div>

      {/* Predefined Programs */}
      <div className="mb-4">
        <div className="text-sm text-gray-400 mb-2">Load Sample Program:</div>
        <div className="flex flex-wrap gap-2">
          {predefinedPrograms.map((program) => (
            <button
              key={program.name}
              onClick={() => loadProgram(program)}
              disabled={isExecuting}
              className="bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-300 px-3 py-2 rounded-md text-sm transition-colors"
            >
              {program.name}
            </button>
          ))}
        </div>
      </div>

      {/* Add New Instruction */}
      <div className="mb-4">
        <div className="text-sm text-gray-400 mb-2">Add Instruction:</div>
        <div className="flex space-x-2">
          <input
            type="text"
            value={newInstruction}
            onChange={(e) => setNewInstruction(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addInstruction()}
            placeholder="e.g., ADD AX, BX"
            disabled={isExecuting}
            className="flex-1 bg-gray-800 border-2 border-gray-700 rounded-lg px-3 py-2 text-white font-mono focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          />
          <button
            onClick={addInstruction}
            disabled={isExecuting || !newInstruction.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 transition-all"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Instruction List */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {instructions.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No instructions loaded</p>
            <p className="text-sm">Add instructions or load a sample program</p>
          </div>
        ) : (
          instructions.map((instruction, index) => (
            <div
              key={index}
              className={`flex items-center space-x-2 p-3 rounded-lg border-2 transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-blue-900/30 border-blue-500 shadow-lg shadow-blue-500/20'
                  : index < currentIndex
                  ? 'bg-green-900/20 border-green-700/50'
                  : 'bg-gray-800 border-gray-700'
              }`}
            >
              <div className="text-sm text-gray-400 w-6">
                {index + 1}
              </div>
              <input
                type="text"
                value={instruction}
                onChange={(e) => updateInstruction(index, e.target.value)}
                disabled={isExecuting}
                className={`flex-1 bg-transparent border-none outline-none font-mono transition-colors ${
                  index === currentIndex
                    ? 'text-blue-300 font-bold'
                    : index < currentIndex
                    ? 'text-green-300'
                    : 'text-gray-300'
                }`}
              />
              <button
                onClick={() => removeInstruction(index)}
                disabled={isExecuting}
                className="text-red-400 hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed p-1 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Progress Indicator */}
      {instructions.length > 0 && (
        <div className="mt-4">
          <div className="text-sm text-gray-400 mb-2">
            Progress: {Math.min(currentIndex + 1, instructions.length)} / {instructions.length}
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(((currentIndex + 1) / instructions.length) * 100, 100)}%`
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}