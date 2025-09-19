import React from 'react';
import { Cpu, Zap } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-gray-900 border-b border-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50" />
          </div>
          
          <div>
            <h1 className="text-3xl font-bold text-white">
              8086 Instruction Simulator
            </h1>
            <p className="text-gray-400 mt-1">
              Interactive microprocessor instruction execution with real-time animations
            </p>
          </div>
          
          <div className="flex-1" />
          
          <div className="flex items-center space-x-2 bg-gray-800 rounded-lg px-4 py-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-gray-300 font-medium">
              Real-time Execution
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}