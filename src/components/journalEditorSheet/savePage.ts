import { systemLogger } from "../../functions/utilities";
import { settings } from "../../settings/settings";
import { createDocumentMemory } from "./documentMemory/createDocumentMemory";
import { dehydrate } from "./documentMemory/dehydrate";
import { rehydrate } from "./documentMemory/rehydrate";
import { save } from "./documentMemory/save";
import { DocumentMemory } from "./documentMemory/types";
import { getMemoryId } from "./getMemoryId";

// this is definitely tuneable. my initial thought was something like 100, while
// that gives great recent fidelity, you're suddenly losing huge chunks of
// deltas after that. 10 seems fair for now.
const MEMORY_PERIOD = 10;

/**
 * Save the content of a JournalEntryPage, update the memory stored against the
 * world, and return the updated memory object. If the supplied memory was
 * undefined a new one is created.
 */
export async function savePage(
  page: any,
  content: string,
  memory: DocumentMemory | undefined,
): Promise<DocumentMemory> {
  // get or create the memory object
  const memoryId = getMemoryId(page);
  // ensure memory exists, by restoring it or creating a new one if needed
  if (memory === undefined) {
    const bareMemory = settings.journalMemories.get()?.[memoryId];
    memory = bareMemory
      ? rehydrate(bareMemory)
      : createDocumentMemory(MEMORY_PERIOD);
  }
  // save the foundry document
  await page.parent.updateEmbeddedDocuments("JournalEntryPage", [
    {
      _id: page.id,
      text: { content },
    },
  ]);
  // update the memory
  memory = save(memory, content);
  // save the memory to the world (settings)
  const journalMemoryCollection = {
    ...settings.journalMemories.get(),
    [memoryId]: dehydrate(memory),
  };
  settings.journalMemories.set(journalMemoryCollection);
  systemLogger.log("Saved page", page.id, content);
  return memory;
}
