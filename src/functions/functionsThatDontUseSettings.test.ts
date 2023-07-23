import { describe, test, expect, vi } from "vitest";

import {
  fixLength,
  isNullOrEmptyString,
  memoizeOnce,
  moveKeyDown,
  moveKeyUp,
  renameProperty,
  sortEntitiesByName,
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

describe("memoizeOnce", () => {
  test("should not run the inner function when the memoized function is created", () => {
    const fn = vi.fn(() => "foo");
    memoizeOnce(fn);
    expect(fn).not.toHaveBeenCalled();
  });
  test("should run the inner function when the memoized function is called", () => {
    const fn = vi.fn(() => "foo");
    const memoized = memoizeOnce(fn);
    const result = memoized();
    expect(result).toEqual("foo");
    expect(fn).toHaveBeenCalledTimes(1);
  });
  test("should not run the inner function again on subsequent calls", () => {
    const fn = vi.fn(() => "foo");
    const memoized = memoizeOnce(fn);
    const result1 = memoized();
    const result2 = memoized();
    const result3 = memoized();
    expect(result1).toEqual("foo");
    expect(result2).toEqual("foo");
    expect(result3).toEqual("foo");
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
