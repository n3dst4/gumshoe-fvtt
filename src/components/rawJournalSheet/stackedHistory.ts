import diff, { Change } from "textdiff-create";

interface Delta {
  change: Change;
  date: string;
}

interface Stack {
  deltas: Delta[];
  snapshot: string;
  next: Stack | null;
}

interface History {
  stack: Stack;
  serial: number;
  periodicity: number;
}

const DEFAULT_PERIODICITY = 100;

function createStack(): Stack {
  return {
    deltas: [],
    snapshot: "",
    next: null,
  };
}

function createHistory(periodicity: number = DEFAULT_PERIODICITY): History {
  return {
    stack: createStack(),
    serial: 0,
    periodicity,
  };
}

export function snapshot(history: History, state: string): History {
  const serial = history.serial + 1;
  const stack = push(history.stack, state, serial, history.periodicity, 0);
  return history;
}

export function calculateOffset(period: number, depth: number): number {
  let sum = 0;
  for (let i = depth - 1; i >= 0; i--) {
    sum += Math.pow(period, i);
  }
  return sum;
}

export function isMagicSerial(period: number, depth: number, serial: number) {
  const offset = calculateOffset(period, depth);
  const isMagicSerial =
    serial >= offset && (serial - offset) % period ** depth === 0;
  return isMagicSerial;
}

function push(
  stack: Stack,
  state: string,
  serial: number,
  period: number,
  depth: number,
): Stack {
  const offset = calculateOffset(period, depth);

  const isMagicPeriod = (serial - offset) % period === 0;

  if (!isMagicPeriod) {
    return stack;
  }

  return stack;
}
