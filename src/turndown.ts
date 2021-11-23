import TurndownService from "turndown";

class SafeTurndownService extends TurndownService {
  // be default, turndown escapes anything that looks like a markdown control
  // character (like `[` or `#`). I see the logic in this, but actually I feel
  // like for our purposes, if you have markdown-like html, you actually want to
  // have that seen as markdown after you convert? Also, it knackers foundry
  // link codes (which can be rectified, admittedly) and when we use turndown to
  // generate "plain text" we certainly don't want anything escaped.
  escape (text: string) {
    return text;
  }
}

const turndownService = new SafeTurndownService();

export function safeTurndown (html: string) {
  return turndownService.turndown(html);
}
