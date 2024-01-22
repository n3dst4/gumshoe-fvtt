import { createStack } from "./createStack";
import { DocumentMemory } from "./types";

/**
 * Create a new empty document memory
 */
export function createDocumentMemory(
  period: number,
  maxDepth: number,
): DocumentMemory {
  return {
    stack: createStack(period),
    serial: 0,
    period,
    maxDepth,
  };
}
