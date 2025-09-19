import { Flags } from '../types/processor';

// Utility helpers for 8086 flag calculations
function maskForSize(size: number): number {
  return (1 << size) - 1; // safe for 8 or 16 bits
}

function signBitForSize(size: number): number {
  return 1 << (size - 1);
}

function toSigned(value: number, size: number): number {
  const sign = signBitForSize(size);
  const mask = maskForSize(size);
  value &= mask;
  return (value & sign) ? value - (mask + 1) : value;
}

export function calculateFlags(result: number, originalResult: number, operation: string): Flags {
  // Determine operation size based on operation type
  // ADD/SUB are typically 8-bit operations, MUL/DIV are 16-bit
  const size = (operation === 'ADD' || operation === 'SUB') ? 8 : 16;
  
  // Mask operands to the correct size
  const mask = maskForSize(size);
  const signBit = signBitForSize(size);
  
  // For ADD/SUB operations, we need to simulate the actual operands
  // Since we only have the result, we'll work with what we have
  // In a real implementation, you'd pass the actual operands
  
  // Truncate the result to the CPU-visible size bits
  const truncatedResult = result & mask;
  
  // Zero Flag: Set when the truncated result is zero
  const ZF = (truncatedResult === 0);
  
  // Sign Flag: Copies the most-significant bit of the truncated result
  const SF = (truncatedResult & signBit) !== 0;
  
  // Carry Flag and Overflow Flag calculations
  let CF = false;
  let OF = false;
  
  if (operation === 'ADD') {
    // For ADD: carry if raw result exceeds the mask (overflow beyond size bits)
    CF = (result > mask);
    
    // For ADD overflow: if operands have same sign, result sign different => OF=1
    // Since we don't have the original operands, we'll use a simplified approach
    // In a real implementation, you'd compare operand signs
    const resultSign = (truncatedResult & signBit) !== 0;
    const originalSign = (originalResult & signBit) !== 0;
    OF = resultSign !== originalSign && Math.abs(result) > (mask >> 1);
  }
  
  else if (operation === 'SUB') {
    // For SUB: borrow/carry is set if unsigned result would be negative
    CF = (result < 0);
    
    // For SUB overflow: if operands have different signs and result sign != operand1 sign
    const resultSign = (truncatedResult & signBit) !== 0;
    const originalSign = (originalResult & signBit) !== 0;
    OF = resultSign !== originalSign && Math.abs(result) > (mask >> 1);
  }
  
  else if (operation === 'MUL') {
    // For MUL: CF and OF are set if upper half of product != 0
    const upperMask = mask << size; // area for upper half
    CF = OF = ((result & (~mask)) !== 0);
  }
  
  else if (operation === 'DIV') {
    // CF is undefined for divide; set to false
    CF = false;
    OF = false;
  }
  
  else {
    // Default behavior for other operations
    CF = false;
    OF = false;
  }
  
  // Debug logging
  console.log('Flag Calculation:', {
    operation,
    size,
    result,
    originalResult,
    truncatedResult,
    ZF,
    SF,
    CF,
    OF
  });
  
  return { ZF, CF, SF, OF };
}

// Enhanced flag calculation with actual operands (for future use)
export function computeFlagsWithOperands({ 
  op, 
  operand1, 
  operand2, 
  rawResult, 
  size = 8 
}: {
  op: string;
  operand1: number;
  operand2: number;
  rawResult: number;
  size?: number;
}): Flags & { result: number } {
  const mask = maskForSize(size);
  const signBit = signBitForSize(size);
  
  // Truncate the raw result to the CPU-visible size bits
  const result = rawResult & mask;
  
  // Zero Flag
  const ZF = (result === 0);
  
  // Sign Flag
  const SF = (result & signBit) !== 0;
  
  // Carry Flag and Overflow Flag
  let CF = false;
  let OF = false;
  
  if (op === 'ADD') {
    CF = (rawResult > mask);
    // Overflow: if operand1 and operand2 have same sign, result sign different => OF=1
    const op1Sign = (operand1 & signBit) !== 0;
    const op2Sign = (operand2 & signBit) !== 0;
    const resSign = (result & signBit) !== 0;
    OF = (op1Sign === op2Sign) && (resSign !== op1Sign);
  }
  
  else if (op === 'SUB') {
    // For SUB: borrow/carry is set if unsigned operand1 < unsigned operand2
    CF = ((operand1 & mask) < (operand2 & mask));
    
    // Overflow: if operand1 and operand2 have different signs and result sign != operand1 sign
    const op1Sign = (operand1 & signBit) !== 0;
    const op2Sign = (operand2 & signBit) !== 0;
    const resSign = (result & signBit) !== 0;
    OF = (op1Sign !== op2Sign) && (resSign !== op1Sign);
  }
  
  else if (op === 'MUL') {
    // For MUL: CF and OF are set if upper half of product != 0
    CF = OF = ((rawResult & (~mask)) !== 0);
  }
  
  else if (op === 'DIV') {
    // CF is undefined for divide
    CF = false;
    OF = false;
  }
  
  else {
    // Default behavior
    CF = false;
    OF = false;
  }
  
  return { ZF, SF, CF, OF, result };
}

export function shouldUpdateFlags(operation: string): boolean {
  return operation !== 'MOV';
}

// Test function to verify flag calculation
export function testFlagCalculation() {
  console.log('=== Testing Flag Calculation ===');
  
  // Test 255 + 1 = 256 (8-bit overflow, should wrap to 0)
  const flags1 = calculateFlags(256, 255, 'ADD');
  console.log('255 + 1 = 256:', flags1);
  console.log('Expected: ZF=true, CF=true, SF=false, OF=false');
  
  // Test 127 + 1 = 128 (8-bit signed overflow)
  const flags2 = calculateFlags(128, 127, 'ADD');
  console.log('127 + 1 = 128:', flags2);
  console.log('Expected: ZF=false, CF=false, SF=true, OF=true');
  
  // Test 0 + 0 = 0
  const flags3 = calculateFlags(0, 0, 'ADD');
  console.log('0 + 0 = 0:', flags3);
  console.log('Expected: ZF=true, CF=false, SF=false, OF=false');
  
  // Test 5 - 10 = -5 (8-bit borrow)
  const flags4 = calculateFlags(-5, 5, 'SUB');
  console.log('5 - 10 = -5:', flags4);
  console.log('Expected: ZF=false, CF=true, SF=true, OF=false');
  
  // Test 65535 + 1 = 65536 (16-bit overflow for MUL/DIV)
  const flags5 = calculateFlags(65536, 65535, 'MUL');
  console.log('65535 + 1 = 65536 (MUL):', flags5);
  console.log('Expected: ZF=true, CF=true, SF=false, OF=true');
}