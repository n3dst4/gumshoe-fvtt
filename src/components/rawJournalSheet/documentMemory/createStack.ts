import { Stack } from "./types";

export function createStack(periodicity: number): Stack {
  return {
    edits: new Array(periodicity).fill(null),
    bombBay: new Array(periodicity - 1).fill(null),
    next: null,
  };
}
