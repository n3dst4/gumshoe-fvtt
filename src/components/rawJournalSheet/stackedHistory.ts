import diff, { Change } from "textdiff-create";

interface Delta {
  change: Change[];
  date: string;
}

interface Stack {
  deltas: Array<Delta | null>;
  snapshot: string;
  next: Stack | null;
}

interface History {
  stack: Stack;
  serial: number;
  periodicity: number;
}

const DEFAULT_PERIODICITY = 100;

function createStack(periodicity: number): Stack {
  return {
    deltas: new Array(periodicity).fill(null),
    snapshot: "",
    next: null,
  };
}

export function createHistory(
  periodicity: number = DEFAULT_PERIODICITY,
): History {
  return {
    stack: createStack(periodicity),
    serial: 0,
    periodicity,
  };
}

/**
 * Given a period and depth, returns whether the serial number is one one where
 * we will trigger a push to the next stack.
 */
export function isMagicSerial(period: number, depth: number, serial: number) {
  // we could cache this in some way (like making isMagicSerial f -> f -> bool)
  // which would help with the speed of tests, but isn't necessary in actual use
  // and just adds complexity
  let offset = 0;
  for (let i = depth - 1; i >= 0; i--) {
    offset += Math.pow(period, i);
  }
  const isMagicSerial =
    serial > offset && (serial - offset) % period ** depth === 0;
  return isMagicSerial;
}

function push(
  stack: Stack,
  newState: string,
  serial: number,
  period: number,
  depth: number,
): Stack {
  const newDelta: Delta = {
    change: diff(stack.snapshot, newState),
    date: new Date().toISOString(),
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
    deltas: [...stack.deltas.slice(1), newDelta],
    snapshot: newState,
    next,
  };
}

export function save(history: History, state: string): History {
  const serial = history.serial + 1;
  const stack = push(history.stack, state, serial, history.periodicity, 1);
  return {
    stack,
    serial,
    periodicity: history.periodicity,
  };
}
