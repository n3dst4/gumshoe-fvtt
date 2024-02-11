import { getStacks } from "./getStacks";
import { DocumentMemory, Edit } from "./types";

export function getAccessibleEdits(memory: DocumentMemory) {
  const stacks = getStacks(memory).reverse();
  const edits: Edit[] = stacks.flatMap((stack) => stack.edits);
  return edits;
}
