// JA TU JESZCZE WRÓCE (KIEDYS)
// OSTANI UPDATE 07/25/2023

const fs = require("fs");

const Types = {
    REGISTER: "REGISTER",
    IMM: "IMM",
    SEGMENT: "SEGMENT",
    POINTER: "POINTER"
}

const SymbolTable = {};

const Registers = {
    AX: 0, // Accumulator
    BX: 0, // Base
    CX: 0, // Counter
    DX: 0, // Destination

    SP: 0, // Stack Pointer
    BP: 0, // Base Pointer
    SI: 0, // Source Index
    DI: 0, // Destination Index

    IP: 0 // Instruction Pointer
};

const Segments = {
    CS: 0, // Code Segment
    DS: 0, // Data Segment
    SS: 0, // Stack Segment
    ES: 0, // Extra Segment
};

const Flags = {
    S: 0, // Sign Flag
    Z: 0, // Zero Flag
    A: 0, // Auxiliary Carry Flag
    P: 0, // Parity Flag
    C: 0, // Carry Flag
    O: 0, // Overflow Flag

    D: 0, // Direction Flag
    I: 0, // Interrupt Flag
    T: 0, // Trap Flag
};

const Internal = {
    Bits: 0,
    DataOrg: 0
}

const Memory = new Uint8Array(0x10000);

const ResolveTable = {
    "AX": Registers.AX,
    "BX": Registers.BX,
    "CX": Registers.CX,
    "DX": Registers.DX,

    "SP": Registers.SP,
    "BP": Registers.BP,
    "SI": Registers.SI,
    "DI": Registers.DI,

    "IP": Registers.IP,

    "CS": Segments.CS,
    "DS": Segments.DS,
    "SS": Segments.SS,
    "ES": Segments.ES,
}

function dereferPointer(ptr, offset) {
    // TODO: implement serio na nastepnym stream ok xdxdd
}

function resolveTarget(target) {
    target = target.toUpperCase();
    if (target.includes('[') && target.includes(']'))
    {
        const realTarget = target.substring(target.indexOf('[') + 1, target.indexOf(']'));
        if (realTarget.includes("+"))
        {
            const [ptr, offset] = realTarget.split('+');
            return dereferPointer(resolveTarget(ptr), parseInt(offset));
        }
        else if (realTarget.includes("-"))
        {
            const [ptr, offset] = realTarget.split('-');
            return dereferPointer(resolveTarget(ptr), parseInt(offset) * -1);
        }
        else {
            return dereferPointer(resolveTarget(realTarget), 0);
        }
    }
    else if (target in ResolveTable) {
        return { type: Types.REGISTER, name: target, value: ResolveTable[target] };
    }
    else {
        return { type: Types.IMM, name: null, value: parseInt(target) };
    }
}

function encodeMov(tokens) {
    if (tokens.length !== 3) throw new Error("Invalid mov syntax");
    
    const preResolveDestination = tokens[1];
    const preResolveSource = tokens[2];

    const destination = resolveTarget(preResolveDestination);
    const source = resolveTarget(preResolveSource);

    if (destination.type === Types.REGISTER && source.type === Types.REGISTER)
    {
        Registers[destination.name] = source.value; 
    }
    else if (destination.type === Types.REGISTER && source.type === Types.IMM)
    {
        Registers[destination.name] = source.value;
    }
    else if (destination.type === Types.SEGMENT && source.type !== Types.REGISTER)
    {
        throw new Error("Invalid mov syntax");    
    }
    else if (destination.type === Types.POINTER && source.type !== Types.REGISTER)
    {
        throw new Error("Invalid mov syntax");    
    }
    else if (destination.type === Types.POINTER && source.type === Types.REGISTER)
    {
        Memory[destination.value] = source.value;    
    }
}

function encodeBits(tokens) {
    if (tokens.length !== 2)
    {
        throw new Error("Invalid bits syntax");
    }

    const bits = tokens[1];
    if (parseInt(bits) !== 16)
    {
        throw new Error("Only 16-bit mode is supported");
    }
    else
    {
        console.log("16-bit mode enabled");
        Internal.Bits = 16;
    }
}

function encodeOrg(tokens) {
    if (tokens.length !== 2)
    {
        throw new Error("Invalid org syntax");    
    }

    const orgAddress = parseInt(tokens[1]);

    if (orgAddress > 0xFFFF || orgAddress === NaN)
    {
        throw new Error("Invalid org address");
    }    

    Registers.IP = orgAddress;
    Internal.DataOrg = orgAddress;

    console.log(`Origin set to ${orgAddress}`);
}

const Instructions = {
    "mov": encodeMov,
    "bits": encodeBits,
    "org": encodeOrg
}

function tokenizer(line)
{
    const tokens = line.split(' ');
    const tttokens = [];
    for (let i = 0; i < tokens.length; i++)
    {
        tttokens.push(tokens[i].replace(/\,/g, ""));
    }

    return tttokens;
}

function parseAssembler() {
    const asmData = fs.readFileSync("main.S", "utf-8");

    const lines = asmData.split('\n');

    for (const line of lines)
    {
        const tokens = tokenizer(line);
        const op = tokens[0].toLowerCase();

        if (op.endsWith(':'))
        {
            const symbolName = op.substring(0, op.length - 1);
            SymbolTable[symbolName] = Registers.IP;
            console.log(`Symbol ${symbolName} set to ${Registers.IP}`);
        }
        else if (op in Instructions)
        {
            Instructions[op](tokens);
        }   
        else if(op.length > 0) {
            console.log(`Unknown instruction ${op}}`);
        }
    }
}

parseAssembler();
console.log(Registers);