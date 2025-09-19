import React, { useState } from 'react';
import { Settings, RotateCcw } from 'lucide-react';

interface RegisterInitPanelProps {
  onSetRegisters: (registers: { AX: number; BX: number; CX: number; DX: number }) => void;
  currentValues: { AX: number; BX: number; CX: number; DX: number };
  disabled: boolean;
}

export function RegisterInitPanel({ onSetRegisters, currentValues, disabled }: RegisterInitPanelProps) {
  const [values, setValues] = useState({
    AX: currentValues.AX,
    BX: currentValues.BX,
    CX: currentValues.CX,
    DX: currentValues.DX
  });

  const handleValueChange = (register: string, value: string) => {
    let numValue = 0;
    
    // Handle hex input (e.g., "FF" or "FFH")
    if (value.toUpperCase().endsWith('H')) {
      // Explicit hex with H suffix
      numValue = parseInt(value.slice(0, -1), 16);
    } else if (value.match(/^[A-Fa-f][0-9A-Fa-f]*$/)) {
      // Only treat as hex if it starts with A-F (explicit hex)
      numValue = parseInt(value, 16);
    } else {
      // Decimal input - parse as base 10 (default)
      numValue = parseInt(value, 10);
    }
    
    // Handle NaN case
    if (isNaN(numValue)) {
      numValue = 0;
    }
    
    // Clamp to 16-bit range
    numValue = Math.max(0, Math.min(65535, numValue));
    
    setValues(prev => ({
      ...prev,
      [register]: numValue
    }));
  };

  const applyValues = () => {
    onSetRegisters(values);
  };

  const resetValues = () => {
    const resetVals = { AX: 0, BX: 0, CX: 0, DX: 0 };
    setValues(resetVals);
    onSetRegisters(resetVals);
  };

  const presetValues = [
    { name: 'All Zero', values: { AX: 0, BX: 0, CX: 0, DX: 0 } },
    { name: 'Test Values', values: { AX: 10, BX: 5, CX: 2, DX: 0 } },
    { name: 'Large Numbers', values: { AX: 1000, BX: 500, CX: 100, DX: 50 } },
    { name: 'Hex Values', values: { AX: 255, BX: 170, CX: 85, DX: 15 } }
  ];

  const loadPreset = (preset: typeof presetValues[0]) => {
    setValues(preset.values);
    onSetRegisters(preset.values);
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center">
        <div className="w-3 h-3 bg-purple-400 rounded-full mr-2 animate-pulse"></div>
        Register Initialization
      </h2>

      {/* Register Input Fields */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {Object.entries(values).map(([register, value]) => (
          <div key={register} className="space-y-2">
            <label className="text-sm text-gray-400 font-medium">
              {register}
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={value.toString()}
                onChange={(e) => handleValueChange(register, e.target.value)}
                disabled={disabled}
                placeholder="0"
                className="flex-1 bg-gray-800 border-2 border-gray-700 rounded-lg px-3 py-2 text-white font-mono focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              />
              <div className="text-xs text-gray-500 flex flex-col justify-center">
                <div>{value.toString(16).toUpperCase().padStart(3, '0')}H</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Control Buttons */}
      <div className="flex space-x-2 mb-4">
        <button
          onClick={applyValues}
          disabled={disabled}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 transition-all"
        >
          <Settings className="w-4 h-4" />
          <span>Apply</span>
        </button>
        <button
          onClick={resetValues}
          disabled={disabled}
          className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </button>
      </div>

      {/* Preset Values */}
      <div>
        <div className="text-sm text-gray-400 mb-2">Quick Presets:</div>
        <div className="grid grid-cols-2 gap-2">
          {presetValues.map((preset) => (
            <button
              key={preset.name}
              onClick={() => loadPreset(preset)}
              disabled={disabled}
              className="bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-300 px-3 py-2 rounded-md text-sm transition-colors"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Input Format Help */}
      <div className="mt-4 p-3 bg-gray-800 rounded-lg">
        <div className="text-sm text-gray-400 mb-1">Input Formats:</div>
        <div className="text-xs text-gray-500 space-y-1">
          <div><span className="font-mono text-cyan-400">255</span> - Decimal (default)</div>
          <div><span className="font-mono text-cyan-400">FF</span> or <span className="font-mono text-cyan-400">FFH</span> - Hexadecimal (must start with A-F or end with H)</div>
          <div>Range: 0 to 65535 (16-bit)</div>
        </div>
      </div>
    </div>
  );
}