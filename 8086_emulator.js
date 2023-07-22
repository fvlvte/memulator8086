// JA TU JESZCZE WRÓCE (KIEDYS)
// OSTANI UPDATE 07/22/2023

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
    // TODO: implement xd
}

function resolveTarget(target) {
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
        return ResolveTable[target];
    }
}

function encodeMov(tokens) {
    const dst = tokens[1];
    const src = tokens[2];
}

const Instructions = {
    "mov": encodeMov
}

// mov ax, 0x1234

function tokenizer(line)
{
    const tokens = line.split(' ').split(',');

    const op = tokens[0];

}

function parseAssembler() {

}