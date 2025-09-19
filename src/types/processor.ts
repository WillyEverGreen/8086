export interface Register {
  name: string;
  value: number;
  displayValue: string;
}

export interface Flags {
  ZF: boolean; // Zero Flag
  CF: boolean; // Carry Flag
  SF: boolean; // Sign Flag
  OF: boolean; // Overflow Flag
}

export interface ProcessorState {
  registers: {
    AX: Register;
    BX: Register;
    CX: Register;
    DX: Register;
  };
  flags: Flags;
  currentInstruction: string;
  isExecuting: boolean;
  currentStep: number;
  instructionList: string[];
  currentInstructionIndex: number;
  executionLog: string[];
  isStepMode: boolean;
}

export interface Instruction {
  operation: string;
  destination?: string;
  source?: string;
  immediate?: number;
}

export type ExecutionStep = 'fetch' | 'decode' | 'execute' | 'writeback' | 'idle';