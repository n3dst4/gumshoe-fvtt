import TurndownService from "turndown";

const turndownService = new TurndownService();

export function turndown (html: string) {
  return turndownService.turndown(html);
}
