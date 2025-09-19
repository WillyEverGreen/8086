import React from 'react';
import { Flags } from '../types/processor';

interface FlagsPanelProps {
  flags: Flags;
}

export function FlagsPanel({ flags }: FlagsPanelProps) {
  const flagInfo = [
    { key: 'ZF', name: 'Zero Flag', description: 'Set when result is zero' },
    { key: 'CF', name: 'Carry Flag', description: 'Set on arithmetic overflow' },
    { key: 'SF', name: 'Sign Flag', description: 'Set when result is negative' },
    { key: 'OF', name: 'Overflow Flag', description: 'Set on signed overflow' }
  ];

  return (
    <div className="bg-gray-900 rounded-lg p-6 shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center">
        <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
        Status Flags
      </h2>
      <div className="space-y-3">
        {flagInfo.map(({ key, name, description }) => {
          const isActive = flags[key as keyof Flags];
          return (
            <div
              key={key}
              className="flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div
                  data-flag={key}
                  className={`w-4 h-4 rounded-full transition-all duration-300 shadow-lg ${
                    isActive
                      ? 'bg-green-500 shadow-green-500/50 ring-2 ring-green-400/30'
                      : 'bg-red-500 shadow-red-500/50 ring-2 ring-red-400/30'
                  }`}
                />
                <div>
                  <div className="text-sm font-semibold text-white">{key}</div>
                  <div className="text-xs text-gray-400">{name}</div>
                </div>
              </div>
              <div className="text-xs text-gray-500 max-w-32 text-right">
                {description}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}