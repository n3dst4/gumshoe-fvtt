import applyDiff from "textdiff-patch";

import { getStacks } from "./getStacks";
import { BareDocumentMemory, DocumentMemory } from "./types";

export function rehydrate(
  bareDocumentMemory: BareDocumentMemory,
): DocumentMemory {
  const stacks = getStacks(bareDocumentMemory);

  const [state, ...snapshots]: string[] = stacks.reduceRight<string[]>(
    (soFar, stack) => {
      const basis = soFar[0];
      const allEdits = [...stack.bombBay, ...stack.edits];
      const snapshot = allEdits.reduce(
        (stateSoFar, edit) => applyDiff(stateSoFar, edit.changes),
        basis,
      );
      return [snapshot, ...soFar];
    },
    [""],
  );

  const memory: DocumentMemory = {
    stack: bareDocumentMemory.stack,
    serial: bareDocumentMemory.serial,
    period: bareDocumentMemory.period,
    maxDepth: bareDocumentMemory.maxDepth,
    state,
    snapshots,
  };

  return memory;
}
