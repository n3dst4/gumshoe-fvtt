import { DocumentMemory, Edit, Stack } from "./types";

function getStacks(memory: DocumentMemory): Stack[] {
  const stacks: Stack[] = [];
  for (let stack: Stack | null = memory.stack; stack; stack = stack.next) {
    stacks.push(stack);
  }
  stacks.reverse();
  return stacks;
}

export function getAccessibleEdits(memory: DocumentMemory) {
  const stacks = getStacks(memory);
  const edits: Edit[] = stacks.flatMap((stack) => stack.edits);
  return edits;
}

// export function listEditsSince(memory: DocumentMemory, timestamp: number) {
//   const stacks = getStacks(memory);
//   const edits: Edit[] = [];
//   let lastTimestamp = Number.MAX_SAFE_INTEGER;
//   for (const stack of stacks) {
//     for (let i = stack.edits.length - 1; i >= 0; i--) {
//       const edit = stack.edits[i];
//       if (edit && edit.timestamp < lastTimestamp && edit.timestamp > timestamp) {
//         edits.push(edit);
//         lastTimestamp = edit?.timestamp ?? Infinity;
//       }
//     }
//   }
//   return edits;
// }
