import { DocumentMemory, Edit, Stack } from "./types";

function getStacks(memory: DocumentMemory): Stack[] {
  const stacks: Stack[] = [];
  for (let stack: Stack | null = memory.stack; stack; stack = stack.next) {
    stacks.push(stack);
  }
  return stacks;
}

export function listEdits(memory: DocumentMemory) {
  const stacks = getStacks(memory);
  const edits: Edit[] = [];
  let lastTimestamp = Infinity;
  for (const stack of stacks) {
    for (let i = stack.edits.length - 1; i >= 0; i--) {
      const edit = stack.edits[i];
      if (edit && edit.timestamp < lastTimestamp) {
        edits.push(edit);
        lastTimestamp = edit?.timestamp;
      }
    }
  }
  // yeah I could return edits.reverse(), but I hate the way it's side-effecty
  // so I like to treat it as if it doesn't return.
  edits.reverse();
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
