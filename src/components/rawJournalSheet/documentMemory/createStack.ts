import { Stack } from "./types";

export function createStack(periodicity: number): Stack {
  return {
    edits: new Array(periodicity).fill(null),
    snapshot: "",
    next: null,
  };
}
