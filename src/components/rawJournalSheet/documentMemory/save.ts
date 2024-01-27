import createDiff, { Change } from "textdiff-create";

import { createStack } from "./createStack";
import { isMagicSerial } from "./isMagicSerial";
import { DocumentMemory, Edit, Stack } from "./types";

/**
 * This function pushes a new state onto a stack and returns the new stack.
 * Recurses down onto deeper stacks if necessary.
 */
function push(
  stack: Stack,
  changes: Change[],
  serial: number,
  period: number,
  depth: number,
  timestamp: number,
  maxDepth: number | null,
  snapshots: string[],
): [Stack, string[]] {
  const newEdit: Edit = {
    changes,
    timestamp,
  };
  let next = stack.next;
  if (
    isMagicSerial(period, depth, serial) &&
    (maxDepth === null || depth < maxDepth)
  ) {
    const lastEditTimestamp =
      stack.edits[stack.edits.length - 1]?.timestamp ?? 0;
    [next, snapshots] = push(
      next ?? createStack(period),
      changes, // wrong
      serial,
      period,
      depth + 1,
      lastEditTimestamp,
      maxDepth,
      snapshots,
    );
  }
  return [
    {
      edits: [...stack.edits.slice(1), newEdit],
      next,
      bombBay: stack.bombBay,
    },
    snapshots,
  ];
}

/**
 * Add a new state to the memory
 */
export function save(memory: DocumentMemory, state: string): DocumentMemory {
  const serial = memory.serial + 1;
  const diff = createDiff(memory.state, state);
  const [stack, snapshots] = push(
    memory.stack,
    diff,
    serial,
    memory.period,
    1,
    Math.floor(Date.now() / 1000),
    memory.maxDepth,
    memory.snapshots,
  );
  return {
    stack,
    serial,
    period: memory.period,
    maxDepth: memory.maxDepth,
    state,
    snapshots,
  };
}
