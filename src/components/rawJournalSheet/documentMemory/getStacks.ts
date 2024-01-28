import { DocumentMemory, Stack } from "./types";

export function getStacks(memory: DocumentMemory): Stack[] {
  const stacks: Stack[] = [];
  for (let stack: Stack | null = memory.stack; stack; stack = stack.next) {
    stacks.push(stack);
  }
  stacks.reverse();
  return stacks;
}
