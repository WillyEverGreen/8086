import React from 'react';
import { Register } from '../types/processor';

interface RegisterPanelProps {
  registers: {
    AX: Register;
    BX: Register;
    CX: Register;
    DX: Register;
  };
}

export function RegisterPanel({ registers }: RegisterPanelProps) {
  return (
    <div className="bg-gray-900 rounded-lg p-6 shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center">
        <div className="w-3 h-3 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
        Registers
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(registers).map(([key, register]) => (
          <div
            key={key}
            data-register={register.name}
            className="bg-gray-800 border-2 border-gray-700 rounded-lg p-4 transition-all duration-300 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/20"
          >
            <div className="text-sm text-gray-400 font-medium mb-1">
              {register.name}
            </div>
            <div
              data-register-value={register.name}
              className="text-2xl font-mono text-cyan-400 font-bold tracking-wider"
            >
              {register.displayValue}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              ({register.value} decimal)
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}