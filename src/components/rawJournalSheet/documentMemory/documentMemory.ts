import diff from "textdiff-create";

import { isMagicSerial } from "./isMagicSerial";
import { DocumentMemory, Edit, Stack } from "./types";

function createStack(periodicity: number): Stack {
  return {
    edits: new Array(periodicity).fill(null),
    snapshot: "",
    next: null,
  };
}

/**
 * Create a new empty document memory
 */
export function createDocumentMemory(periodicity: number): DocumentMemory {
  return {
    stack: createStack(periodicity),
    serial: 0,
    period: periodicity,
  };
}

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
): Stack {
  const newDelta: Edit = {
    change: diff(stack.snapshot, newState),
    timestamp: new Date().toISOString(),
  };
  let next = stack.next;
  if (isMagicSerial(period, depth, serial)) {
    next = push(
      next ?? createStack(period),
      stack.snapshot,
      serial,
      period,
      depth + 1,
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
  const stack = push(memory.stack, state, serial, memory.period, 1);
  return {
    stack,
    serial,
    period: memory.period,
  };
}
