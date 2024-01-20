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

export function createHistory(periodicity: number): DocumentMemory {
  return {
    stack: createStack(periodicity),
    serial: 0,
    period: periodicity,
  };
}

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

export function save(history: DocumentMemory, state: string): DocumentMemory {
  const serial = history.serial + 1;
  const stack = push(history.stack, state, serial, history.period, 1);
  return {
    stack,
    serial,
    period: history.period,
  };
}
