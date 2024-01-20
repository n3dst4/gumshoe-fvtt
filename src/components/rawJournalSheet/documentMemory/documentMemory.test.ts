import { afterAll, beforeEach, describe, expect, test, vi } from "vitest";

import { ArrayOfNulls } from "./ArrayOfNullsEqualityTester";
import { createHistory, save } from "./documentMemory";

const epoch = "1970-01-01T00:00:01.000Z";

function advanceTime10s() {
  vi.setSystemTime(new Date().setSeconds(new Date().getSeconds() + 10));
}

beforeEach(() => {
  vi.setSystemTime(new Date(epoch));
});

afterAll(() => {
  vi.useRealTimers();
});

describe("createHistory", () => {
  test.each([3, 4, 5, 6, 100, 1000])(
    "creates an empty history with period %i",
    (period) => {
      const history = createHistory(period);
      expect(history).toEqual({
        stack: {
          edits: new ArrayOfNulls(period),
          snapshot: "",
          next: null,
        },
        serial: 0,
        period,
      });
    },
  );
});

test("starts", () => {
  const h1 = createHistory(3);
  const h2 = save(h1, "foo");
  expect(h2).toEqual({
    stack: {
      edits: [
        null,
        null,
        {
          change: [[1, "foo"]],
          timestamp: epoch,
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
  let h = createHistory(3);
  const states = ["foo", "foobar", "bar"];
  for (const state of states) {
    h = save(h, state);
    advanceTime10s();
  }
  expect(h).toMatchSnapshot();
});

test("stores a sequence of edits onto the next stack", () => {
  let h = createHistory(3);
  const states = ["foo", "foobar", "bar", "barbaz"];
  for (const state of states) {
    h = save(h, state);
    advanceTime10s();
  }
  expect(h).toMatchSnapshot();
});

test("stores a sequence of edits onto the third stack", () => {
  let h = createHistory(3);
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
  ];
  for (const state of states) {
    h = save(h, state);
    advanceTime10s();
  }
  expect(h).toMatchSnapshot();
});
