import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";

import {
  debounce,
  fixLength,
  isNullOrEmptyString,
  memoizeNullaryOnce,
  moveKeyDown,
  moveKeyUp,
  renameProperty,
  sortByKey,
  sortEntitiesByName,
  throttle,
} from "./functionsThatDontUseSettings";

const obj = {
  a: 1,
  b: 2,
  c: 3,
};

describe("moveKeyUp", () => {
  test.each([
    ["b", { b: 2, a: 1, c: 3 }],
    ["c", { c: 3, a: 1, b: 2 }],
  ])("move %s up", (key, expected) => {
    expect(moveKeyUp(obj, key)).toEqual(expected);
  });
  test("move a up", () => {
    expect(() => moveKeyUp(obj, "a")).toThrow();
  });
});

describe("moveKeyDown", () => {
  test.each([
    ["b", { a: 1, c: 3, b: 2 }],
    ["a", { b: 2, a: 1, c: 3 }],
  ])("move %s down", (key, expected) => {
    expect(moveKeyDown(obj, key)).toEqual(expected);
  });
  test("move c up", () => {
    expect(() => moveKeyDown(obj, "c")).toThrow();
  });
});

describe("fixLength", () => {
  test.each([
    [null, 5, "xxxxx"],
    [undefined, 5, "xxxxx"],
    ["", 5, "xxxxx"],
    ["yy", 5, "yyxxx"],
    ["yyyyy", 5, "yyyyy"],
    ["yyyyyy", 5, "yyyyy"],
    ["knickers", 5, "knick"],
  ])("fixLength(%s)", (orig, n, expected) => {
    expect(fixLength(orig?.split(""), n, "x").join("")).toEqual(expected);
  });
});

describe("sortEntitiesByName", () => {
  test.each([
    [
      ["", ""],
      ["", ""],
    ],
    [
      ["a", "b"],
      ["a", "b"],
    ],
    [
      ["b", "a"],
      ["a", "b"],
    ],
    [
      ["a", "b", "c"],
      ["a", "b", "c"],
    ],
    [
      ["c", "b", "a"],
      ["a", "b", "c"],
    ],
    [
      ["a", null, "b"],
      [null, "a", "b"],
    ],
  ])("sortEntitiesByName(%s, %s)", (inputStrings, expected) => {
    const inputObjects = inputStrings.map((name) => ({ name }));
    const sorted = sortEntitiesByName(inputObjects);
    const outputStrings = sorted.map(({ name }) => name);
    expect(outputStrings).toEqual(expected);
  });
});

describe("isNullOrEmptyString", () => {
  test.each([
    [null, true],
    [undefined, true],
    ["", true],
    [" ", false],
    ["a", false],
  ])("isNullOrEmptyString(%s)", (input, expected) => {
    expect(isNullOrEmptyString(input)).toEqual(expected);
  });
});

describe("renameProperty", () => {
  test.each([
    [{ a: 1 }, "a", "b", { b: 1 }],
    [{ a: 1, b: 2 }, "a", "c", { c: 1, b: 2 }],
    [{ a: 1, b: 2 }, "b", "c", { a: 1, c: 2 }],
  ])("renameProperty(%s, %s, %s)", (input, oldName, newName, expected) => {
    expect(renameProperty(oldName, newName, input)).toEqual(expected);
  });
});

describe("memoizeNullaryOnce", () => {
  test("should not run the inner function when the memoized function is created", () => {
    const fn = vi.fn(() => "foo");
    memoizeNullaryOnce(fn);
    expect(fn).not.toHaveBeenCalled();
  });
  test("should run the inner function when the memoized function is called", () => {
    const fn = vi.fn(() => "foo");
    const memoized = memoizeNullaryOnce(fn);
    const result = memoized();
    expect(result).toEqual("foo");
    expect(fn).toHaveBeenCalledTimes(1);
  });
  test("should not run the inner function again on subsequent calls", () => {
    const fn = vi.fn(() => "foo");
    const memoized = memoizeNullaryOnce(fn);
    const result1 = memoized();
    const result2 = memoized();
    const result3 = memoized();
    expect(result1).toEqual("foo");
    expect(result2).toEqual("foo");
    expect(result3).toEqual("foo");
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

describe("sortByKey", () => {
  test.each([
    ["empty", [], []],
    ["single", [{ name: "a" }], [{ name: "a" }]],
    ["no-op", [{ name: "a" }, { name: "b" }], [{ name: "a" }, { name: "b" }]],
    [
      "reversal",
      [{ name: "b" }, { name: "a" }],
      [{ name: "a" }, { name: "b" }],
    ],
    [
      "three",
      [{ name: "b" }, { name: "c" }, { name: "a" }],
      [{ name: "a" }, { name: "b" }, { name: "c" }],
    ],
  ])("string, %s", (name, input, expected) => {
    expect(sortByKey(input, "name")).toEqual(expected);
  });
  test.each([
    [
      "three",
      [{ name: 2 }, { name: 3 }, { name: 1 }],
      [{ name: 1 }, { name: 2 }, { name: 3 }],
    ],
  ])("number, %s", (name, input, expected) => {
    expect(sortByKey(input, "name")).toEqual(expected);
  });
});

describe("throttle", () => {
  beforeAll(() => {
    vi.useFakeTimers();
  });
  afterAll(() => {
    vi.useRealTimers();
  });
  test("should only call the function once per interval", async () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);
    throttled();
    throttled();
    throttled();
    throttled();
    throttled();
    expect(fn).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
    throttled();
    throttled();
    throttled();
    throttled();
    throttled();
    expect(fn).toHaveBeenCalledTimes(2);
  });
});

describe("debounce", () => {
  beforeAll(() => {
    vi.useFakeTimers();
  });
  afterAll(() => {
    vi.useRealTimers();
  });
  test("should only call the function after the interval has elapsed", async () => {
    const fn = vi.fn();
    const throttled = debounce(fn, 100);
    throttled();
    throttled();
    throttled();
    throttled();
    throttled();
    expect(fn).toHaveBeenCalledTimes(0);
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
    throttled();
    throttled();
    throttled();
    throttled();
    throttled();
    expect(fn).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(2);
  });
});
