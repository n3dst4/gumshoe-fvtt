import { DocumentMemory, Stack } from "./types";

export function listEdits(memory: DocumentMemory) {
  const stacks: Stack[] = [];
  for (let stack: Stack | null = memory.stack; stack; stack = stack.next) {
    stacks.push(stack);
  }
}
