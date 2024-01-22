import { createStack } from "./createStack";
import { DocumentMemory } from "./types";

/**
 * Create a new empty document memory
 */
export function createDocumentMemory(
  period: number,
  maxDepth: number | null = null,
): DocumentMemory {
  return {
    stack: createStack(period),
    serial: 0,
    period,
    maxDepth,
  };
}
