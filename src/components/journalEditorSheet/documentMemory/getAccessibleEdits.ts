import { getStacks } from "./getStacks";
import { BareDocumentMemory, Edit } from "./types";

export function getAccessibleEdits(memory: BareDocumentMemory) {
  const stacks = getStacks(memory).reverse();
  const edits: Edit[] = stacks.flatMap((stack) => stack.edits);
  return edits;
}
