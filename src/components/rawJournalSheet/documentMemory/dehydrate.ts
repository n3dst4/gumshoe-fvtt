import { BareDocumentMemory, DocumentMemory } from "./types";

export function dehydrate(documentMemory: DocumentMemory): BareDocumentMemory {
  return {
    stack: documentMemory.stack,
    serial: documentMemory.serial,
    period: documentMemory.period,
    maxDepth: documentMemory.maxDepth,
  };
}
