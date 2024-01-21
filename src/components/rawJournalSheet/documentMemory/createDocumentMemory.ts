import { createStack } from "./createStack";
import { DocumentMemory } from "./types";

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
