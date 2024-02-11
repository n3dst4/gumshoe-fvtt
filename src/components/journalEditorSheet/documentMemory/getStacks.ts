import { BareDocumentMemory, Stack } from "./types";

export function getStacks(memory: BareDocumentMemory): Stack[] {
  const stacks: Stack[] = [];
  for (let stack: Stack | null = memory.stack; stack; stack = stack.next) {
    stacks.push(stack);
  }
  return stacks;
}
