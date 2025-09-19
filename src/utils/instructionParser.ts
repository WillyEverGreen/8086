import { Instruction } from '../types/processor';

export function parseInstruction(input: string): Instruction | null {
  const trimmed = input.trim().toUpperCase();
  if (!trimmed) return null;

  // Match patterns: ADD AX, BX | MOV BX, 5 | MUL BX | DIV CX
  const patterns = [
    // Two operand instructions (ADD, SUB, MOV)
    /^(ADD|SUB|MOV)\s+([A-D]X),\s*([A-D]X|[0-9A-F]+H?|\d+)$/,
    // One operand instructions (MUL, DIV)
    /^(MUL|DIV)\s+([A-D]X)$/
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match) {
      const [, operation, dest, src] = match;
      
      if (src) {
        // Check if source is a register or immediate value
        const isRegister = /^[A-D]X$/.test(src);
        if (isRegister) {
          return { operation, destination: dest, source: src };
        } else {
          // Parse immediate value (hex or decimal)
          let value = 0;
          if (src.endsWith('H')) {
            // Hexadecimal value - remove H and parse as hex
            const hexStr = src.slice(0, -1);
            value = parseInt(hexStr, 16);
            if (isNaN(value)) {
              console.error(`Invalid hex value: ${src}`);
              return null;
            }
          } else {
            // Decimal value - parse as base 10
            value = parseInt(src, 10);
            if (isNaN(value)) {
              console.error(`Invalid decimal value: ${src}`);
              return null;
            }
          }
          
          // Ensure value is within 16-bit range (0 to 65535)
          value = Math.max(0, Math.min(65535, value));
          return { operation, destination: dest, immediate: value };
        }
      } else {
        // Single operand instruction
        return { operation, source: dest };
      }
    }
  }

  return null;
}

export function validateRegister(reg: string): boolean {
  return ['AX', 'BX', 'CX', 'DX'].includes(reg.toUpperCase());
}

export function formatHex(value: number): string {
  // Ensure value is within 16-bit range
  const clampedValue = Math.max(0, Math.min(65535, Math.floor(value)));
  return `${clampedValue.toString(16).toUpperCase().padStart(3, '0')}H`;
}

export function clampToWord(value: number): number {
  return Math.max(0, Math.min(65535, Math.floor(value)));
}