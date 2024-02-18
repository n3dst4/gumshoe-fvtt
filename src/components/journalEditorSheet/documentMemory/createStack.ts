import { Stack } from "./types";

export function createStack(periodicity: number): Stack {
export function createStack(): Stack {
  return {
    edits: [],
    bombBay: [],
    next: null,
  };
}
