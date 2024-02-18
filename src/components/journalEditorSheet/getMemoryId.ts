/**
 * Generate a string id for a JournalEntryPage which should hopefulyy be
 * globally unique. Foundry allows duplicate keys across compendium packs.
 */
export function getMemoryId(page: any): string {
  return `${page.parent.pack}$$${page.parent.id}$$${page.id}`;
}
