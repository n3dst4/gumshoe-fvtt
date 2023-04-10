import { escape as escapeText } from "html-escaper";
import { NoteFormat } from "./types";
import {
  FilterXSS,
  whiteList as defaultXssWhitelist,
  escapeAttrValue,
} from "xss";
import memoize from "lodash/memoize";

const makeTurndownService = memoize(async () => {
  console.log("Making turndown service");
  const { default: TurndownService } = await import("turndown");
  class SafeTurndownService extends TurndownService {
    // by default, turndown escapes anything that looks like a markdown control
    // character (like `[` or `#`). I see the logic in this, but actually I feel
    // like for our purposes, if you have markdown-like html, you actually want to
    // have that seen as markdown after you convert? Also, it knackers foundry
    // link codes (which can be rectified, admittedly) and when we use turndown to
    // generate "plain text" we certainly don't want anything escaped.
    escape(text: string) {
      return text;
    }
  }
  // actual turndownservice object for later use
  const turndownService = new SafeTurndownService();
  return turndownService;
});

// build a custom shitelist for xss that adds "style" to the allowed attributes
// for everything
const newWhitelist = Object.fromEntries(
  Object.entries(defaultXssWhitelist).map(([tag, attrList = []]) => [
    tag,
    [...attrList, "style"],
  ]),
);

// copilot said this but it does not work
// newWhitelist["*"] = ["style"];

// custom xss to allow style attributes and allow images with src attributes.
// Yes, it's not ideal XSS, but then again this is a collaborative, trusted
// environment.
const xss = new FilterXSS({
  whiteList: newWhitelist,
  onTagAttr: function (tag, name, value, isWhiteAttr) {
    if (tag === "img" && name === "src") {
      // escape its value using built-in escapeAttrValue function
      return name + '="' + escapeAttrValue(value) + '"';
    }
  },
});

// /////////////////////////////////////////////////////////////////////////////
// Converters
// /////////////////////////////////////////////////////////////////////////////

export function plainTextToHtml(source: string) {
  return escapeText(source).replace(/\n/g, "<br/>");
}

async function markdownToHtml(markdown: string) {
  const { marked } = await import("marked");
  return marked(markdown);
}

export async function htmlToMarkdown(html: string) {
  // ever first-time a cool regex and then realise you don't need it, but
  // you're so proud of your ninja regex skills dating back to doing Perl in the
  // 90s that you want to leave it in as a comment? Anyway check this bad boy
  // out. Turns out I don't need it because I've overridden turndown to stop it
  // doing any escaping at all.
  // return turndown(source).replace(/@(\w+)\\\[(\w+)\\\]\{([^}]*)\}/g, (m, p1, p2, p3) => `@${p1}[${p2}]{${p3}}`);
  const turndownService = await makeTurndownService();
  return turndownService.turndown(html);
}

export function htmlToPlaintext(html: string) {
  return htmlToMarkdown(html);
}

export async function convertNotes(
  oldFormat: NoteFormat,
  newFormat: NoteFormat,
  oldSource: string,
) {
  let newSource = "";
  let unsafeNewHtml = "";
  if (newFormat === NoteFormat.plain) {
    if (oldFormat === NoteFormat.markdown || oldFormat === NoteFormat.plain) {
      newSource = oldSource;
    } else if (oldFormat === NoteFormat.richText) {
      newSource = await htmlToPlaintext(oldSource);
    }
    unsafeNewHtml = plainTextToHtml(newSource);
  } else if (newFormat === NoteFormat.markdown) {
    if (oldFormat === NoteFormat.plain || oldFormat === NoteFormat.markdown) {
      newSource = oldSource;
    } else if (oldFormat === NoteFormat.richText) {
      newSource = await htmlToMarkdown(oldSource);
    }
    unsafeNewHtml = await markdownToHtml(newSource);
  } else if (newFormat === NoteFormat.richText) {
    if (oldFormat === NoteFormat.plain) {
      newSource = plainTextToHtml(oldSource);
    } else if (oldFormat === NoteFormat.markdown) {
      newSource = await markdownToHtml(oldSource);
    } else if (oldFormat === NoteFormat.richText) {
      newSource = oldSource;
    }
    unsafeNewHtml = newSource;
  }
  const newHtml = TextEditor.enrichHTML(xss.process(unsafeNewHtml));
  return { newSource, newHtml };
}

export async function toHtml(format: NoteFormat, source: string) {
  let newHtml = "";
  if (format === NoteFormat.plain) {
    newHtml = plainTextToHtml(source);
  } else if (format === NoteFormat.markdown) {
    newHtml = await markdownToHtml(source);
  } else if (format === NoteFormat.richText) {
    newHtml = source;
  }
  const xssed = xss.process(newHtml);
  const html = TextEditor.enrichHTML(xssed);
  return html;
}
