import createDiff from "textdiff-create";
import applyDiff from "textdiff-patch";

import { createStack } from "./createStack";
import { isMagicSerial } from "./isMagicSerial";
import { DocumentMemory, Edit, Stack } from "./types";

/**
 * This function pushes a new state onto a stack and returns the new stack.
 * Recurses down onto deeper stacks if necessary.
 */
function push(
  stack: Stack,
  newEdit: Edit,
  serial: number,
  period: number,
  depth: number,
  maxDepth: number | null,
  snapshots: string[],
): [Stack, string[]] {
  let nextStack = stack.next;

  // the new bombBay is the old bombBay plus the overflow from edits
  const bombBay: Edit[] = [...stack.bombBay];
  if (stack.edits.length >= period) {
    bombBay.push(stack.edits[0]);
  }

  // the new edits
  const edits = [
    ...stack.edits.slice(stack.edits.length === period ? 1 : 0),
    newEdit,
  ];

  if (
    isMagicSerial(period, depth, serial) &&
    (maxDepth === null || depth < maxDepth)
  ) {
    // calculate the current snapshot by applying edits
    const snapShot = snapshots[depth];
    let newState = snapShot;
    for (const edit of stack.bombBay) {
      newState = applyDiff(snapShot, edit.changes);
    }
    const editToPush: Edit = {
      changes: createDiff(snapShot, newState),
      timestamp: bombBay[bombBay.length - 1].timestamp,
    };

    [nextStack, snapshots] = push(
      nextStack || createStack(period),
      editToPush,
      serial,
      period,
      depth + 1,
      maxDepth,
      snapshots,
    );
  }

  return [
    {
      bombBay,
      edits,
      next: nextStack,
    },
    snapshots,
  ];
}

/**
 * Add a new state to the memory
 */
export function save(memory: DocumentMemory, state: string): DocumentMemory {
  const serial = memory.serial + 1;
  const changes = createDiff(memory.state, state);
  const edit: Edit = {
    changes,
    timestamp: Math.floor(Date.now() / 1000),
  };
  const [stack, snapshots] = push(
    memory.stack,
    edit,
    serial,
    memory.period,
    1,
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
