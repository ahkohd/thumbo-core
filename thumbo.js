import * as wasm from "./thumbo_core_bg.wasm";
export * from "./thumbo_core_bg.js";

export const memory = wasm.memory;

export const readFromMemory = (result) => {
    return new Uint8Array(memory.buffer, result.img_ptr, result.img_size);
};
