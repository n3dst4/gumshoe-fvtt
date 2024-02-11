import { Stack } from "./types";

export function createStack(periodicity: number): Stack {
  return {
    edits: [],
    bombBay: [],
    next: null,
  };
}
