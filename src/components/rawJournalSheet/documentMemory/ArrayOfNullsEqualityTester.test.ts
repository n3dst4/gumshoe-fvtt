import { describe, expect, test } from "vitest";

import { ArrayOfNulls } from "./ArrayOfNullsEqualityTester";

describe("array of nulls custom equality", () => {
  test.each([[[]], [[null]], [[null, null]], [[null, null, null]]])(
    "%s is an array of nulls",
    (value) => {
      expect(value).toEqual(new ArrayOfNulls(value.length));
    },
  );
  test.each([
    [[0], 1],
    [[1], 1],
    [[1, 2], 2],
    [[1, 2, 3], 3],
    [[null, null, null], 1],
  ])("%s is not an array of nulls of length %i", (value, length) => {
    expect(value).not.toEqual(new ArrayOfNulls(length));
  });
  test("Two ArrayOfNulls objects", () => {
    expect(new ArrayOfNulls(3)).toEqual(new ArrayOfNulls(3));
  });
  test("Two ArrayOfNulls objects (different length parameters)", () => {
    expect(new ArrayOfNulls(3)).not.toEqual(new ArrayOfNulls(4));
  });
});
