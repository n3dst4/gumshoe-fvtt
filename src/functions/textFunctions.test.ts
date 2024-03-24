import { describe, expect, test } from "vitest";

import { NoteFormat } from "../types";
import { convertNotes, toHtml } from "./textFunctions";

const markdownSample = `# This is a title

This is a paragraph. The next thing is a dangerous script tag:

## This is a subtitle

This is another paragraph. It has a [link](https://example.com) in it. It's quite long
and has a line break in it.

<script>alert("hello")</script>

This is a list:

- item 1
- item 2
- item 3
`;

describe("toHtml", async () => {
  const html = await toHtml(NoteFormat.markdown, markdownSample);
  test("converts plain text to html", async () => {
    const result = await toHtml(NoteFormat.plain, markdownSample);
    expect(result).toMatchSnapshot();
  });
  test("converts markdown to html", () => {
    expect(html).toMatchSnapshot();
  });
  test("converts rich text to html", async () => {
    const result = await toHtml(NoteFormat.richText, html);
    expect(result).toMatchSnapshot();
  });
});

describe("convertNotes", async () => {
  const html = await toHtml(NoteFormat.markdown, markdownSample);

  test.each([
    [NoteFormat.plain, NoteFormat.plain, markdownSample, markdownSample],
    [NoteFormat.plain, NoteFormat.markdown, markdownSample, markdownSample],
    [NoteFormat.markdown, NoteFormat.plain, markdownSample, markdownSample],
    [NoteFormat.markdown, NoteFormat.markdown, markdownSample, markdownSample],
    [NoteFormat.richText, NoteFormat.richText, html, html],
  ])("converts %s to %s", async (oldFormat, newFormat, input, expected) => {
    const { newSource: result } = await convertNotes(
      oldFormat,
      newFormat,
      input,
    );
    expect(result).toBe(expected);
  });
  test.each([
    [NoteFormat.plain, NoteFormat.richText, markdownSample],
    [NoteFormat.markdown, NoteFormat.richText, markdownSample],
    [NoteFormat.richText, NoteFormat.plain, html],
    [NoteFormat.richText, NoteFormat.markdown, html],
  ])("converts %s to %s", async (oldFormat, newFormat, input) => {
    const result = await convertNotes(oldFormat, newFormat, input);
    expect(result).toMatchSnapshot();
  });
});
