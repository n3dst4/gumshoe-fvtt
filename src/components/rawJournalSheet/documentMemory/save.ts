import diff from "textdiff-create";

import { createStack } from "./createStack";
import { isMagicSerial } from "./isMagicSerial";
import { DocumentMemory, Edit, Stack } from "./types";

/**
 * This function pushes a new state onto a stack and returns the new stack.
 * Recurses down onto deeper stacks if necessary.
 */
function push(
  stack: Stack,
  newState: string,
  serial: number,
  period: number,
  depth: number,
  timestamp: number,
  maxDepth: number | null,
): Stack {
  const newDelta: Edit = {
    change: diff(stack.snapshot, newState),
    timestamp,
  };
  let next = stack.next;
  if (
    isMagicSerial(period, depth, serial) &&
    (maxDepth === null || depth < maxDepth)
  ) {
    const lastEditTimestamp =
      stack.edits[stack.edits.length - 1]?.timestamp ?? 0;
    next = push(
      next ?? createStack(period),
      stack.snapshot,
      serial,
      period,
      depth + 1,
      lastEditTimestamp,
      maxDepth,
    );
  }
  return {
    edits: [...stack.edits.slice(1), newDelta],
    snapshot: newState,
    next,
  };
}

/**
 * Add a new state to the memory
 */
export function save(memory: DocumentMemory, state: string): DocumentMemory {
  const serial = memory.serial + 1;
  const stack = push(
    memory.stack,
    state,
    serial,
    memory.period,
    1,
    Math.floor(Date.now() / 1000),
    memory.maxDepth,
  );
  return {
    stack,
    serial,
    period: memory.period,
    maxDepth: memory.maxDepth,
  };
}
