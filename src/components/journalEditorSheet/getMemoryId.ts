export function getMemoryId(page: any): string {
  return `${page.parent.pack}$$${page.parent.id}$$${page.id}`;
}
