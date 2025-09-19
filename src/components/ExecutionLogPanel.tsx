import React from 'react';
import { ScrollText, Trash2 } from 'lucide-react';

interface ExecutionLogPanelProps {
  log: string[];
  onClearLog: () => void;
}

export function ExecutionLogPanel({ log, onClearLog }: ExecutionLogPanelProps) {
  return (
    <div className="bg-gray-900 rounded-lg p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white flex items-center">
          <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
          Execution Log
        </h2>
        <button
          onClick={onClearLog}
          disabled={log.length === 0}
          className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 py-2 rounded-lg font-semibold flex items-center space-x-2 transition-all text-sm"
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear</span>
        </button>
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto">
        {log.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <ScrollText className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No executions yet</p>
            <p className="text-sm">Run instructions to see execution log</p>
          </div>
        ) : (
          log.map((entry, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-lg p-3 border-l-4 border-green-500"
            >
              <div className="flex items-center space-x-2">
                <div className="text-xs text-gray-400 w-8">
                  {index + 1}
                </div>
                <div className="text-sm text-gray-300 font-mono flex-1">
                  {entry}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {log.length > 0 && (
        <div className="mt-4 text-xs text-gray-500 text-center">
          {log.length} instruction{log.length !== 1 ? 's' : ''} executed
        </div>
      )}
    </div>
  );
}