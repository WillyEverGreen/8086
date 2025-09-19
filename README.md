# 8086 Microprocessor Simulator

An interactive 8086 microprocessor simulator with step-by-step execution and real-time visualization of the processor architecture.

## Features

### Enhanced Step Mode
- **Pipeline Stage Control**: In step mode, you can control each individual pipeline stage (Fetch, Decode, Execute, Writeback)
- **User-Controlled Progression**: Press "Next Step" to advance through each pipeline stage manually
- **Visual Feedback**: Each component highlights when it's active during execution
- **Step Counter**: Shows current pipeline stage (1/4, 2/4, etc.) and detailed descriptions

### Processor Architecture Visualization
The simulator now includes a comprehensive visualization of the 8086 processor components:

- **Memory**: Stores instructions and data
- **Instruction Register**: Holds the current instruction being processed
- **Control Unit**: Decodes instructions and generates control signals
- **Arithmetic Logic Unit (ALU)**: Performs arithmetic and logical operations
- **Register Bank**: Contains general-purpose registers (AX, BX, CX, DX)
- **Flags**: Status flags (ZF, CF, SF, OF)

### Supported Instructions
- `MOV` - Move data between registers or immediate values
- `ADD` - Add values
- `SUB` - Subtract values
- `MUL` - Multiply (uses AX and stores result in AX:DX)
- `DIV` - Divide (uses AX and stores quotient in AX, remainder in DX)

### Animation System
- **Component Highlighting**: Each processor component glows when active
- **Data Flow Animation**: Visual representation of data moving between components
- **Value Transfer**: Animated display of values being transferred
- **Pipeline Progress**: Real-time pipeline stage indicators

## How to Use

### Step Mode
1. **Enable Step Mode**: Click the "Step Mode" button in the Instruction List panel
2. **Load Instructions**: Add instructions or load a sample program
3. **Start Execution**: Click "Next Instruction" to begin processing
4. **Control Pipeline**: Use "Next Step" button in the ALU panel to advance through each pipeline stage
5. **Observe**: Watch as each component activates and data flows through the processor

### Run Mode
1. **Load Instructions**: Add instructions or load a sample program
2. **Run All**: Click "Run All" to execute all instructions automatically
3. **Watch**: Observe the complete execution with automatic progression

### Sample Programs
The simulator includes predefined programs:
- **Basic Arithmetic**: Demonstrates ADD, SUB, and MUL operations
- **Division Example**: Shows DIV operation with remainder handling
- **Register Transfer**: Demonstrates MOV operations between registers

## Technical Details

### Pipeline Stages
1. **Fetch**: Read instruction from memory into instruction register
2. **Decode**: Analyze instruction and prepare control signals
3. **Execute**: Perform arithmetic/logic operation in ALU
4. **Writeback**: Store result back to register file

### Register System
- **AX, BX, CX, DX**: 16-bit general-purpose registers
- **Flags**: Zero Flag (ZF), Carry Flag (CF), Sign Flag (SF), Overflow Flag (OF)

### Data Types
- All values are 16-bit (0x0000 to 0xFFFF)
- Results are automatically clamped to 16-bit range
- Hexadecimal display format

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Open Browser**: Navigate to the local development URL

4. **Try Step Mode**:
   - Enable step mode
   - Load "Basic Arithmetic" sample program
   - Click "Next Instruction"
   - Use "Next Step" to advance through pipeline stages
   - Observe the processor components and data flow

## Architecture

The application is built with:
- **React** with TypeScript
- **Tailwind CSS** for styling
- **GSAP** for animations
- **Lucide React** for icons

The processor simulation includes:
- State management for registers, flags, and execution state
- Pipeline stage management
- Animation system for visual feedback
- Instruction parsing and execution engine
