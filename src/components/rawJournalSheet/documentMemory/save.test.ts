import { afterAll, beforeEach, expect, test, vi } from "vitest";

import { createDocumentMemory } from "./createDocumentMemory";
import { save } from "./save";

const epoch = 0;

function advanceTime10s() {
  vi.setSystemTime(new Date().setSeconds(new Date().getSeconds() + 10));
}

beforeEach(() => {
  vi.setSystemTime(new Date(epoch));
});

afterAll(() => {
  vi.useRealTimers();
});

test("starts", () => {
  const h1 = createDocumentMemory(3);
  const h2 = save(h1, "foo");
  expect(h2).toEqual({
    stack: {
      edits: [
        null,
        null,
        {
          change: [[1, "foo"]],
          timestamp: expect.closeTo(epoch),
        },
      ],
      snapshot: "foo",
      next: null,
    },
    serial: 1,
    period: 3,
  });
});

test("stores a sequence of edits", () => {
  let h = createDocumentMemory(3);
  const states = ["a", "ab", "abc"];
  for (const state of states) {
    h = save(h, state);
    advanceTime10s();
  }
  expect(h).toMatchSnapshot();
});

test("stores a sequence of edits onto the next stack", () => {
  let h = createDocumentMemory(3);
  const states = [
    "a", // 1
    "ab", // 2
    "abc", // 3
    "abcd", // 4
  ];
  for (const state of states) {
    h = save(h, state);
    advanceTime10s();
  }
  expect(h).toMatchSnapshot();
});

test("stores a sequence of edits onto the third stack", () => {
  let h = createDocumentMemory(3);
  const states = [
    "a",
    "ab",
    "abc",
    "abcd",
    "abcde",
    "abcdef",
    "abcdefg",
    "abcdefgh",
    "abcdefghi",
    "abcdefghij",
    "abcdefghijk",
    "abcdefghijkl",
    "abcdefghijklm",
    "abcdefghijklmn",
  ];
  for (const state of states) {
    h = save(h, state);
    advanceTime10s();
  }
  expect(h).toMatchSnapshot();
});
