import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";

import { createHistory, isMagicSerial, save } from "./stackedHistory";

describe("isMagicSerial", () => {
  function describePeriod(period: number, testData: Array<[number, number[]]>) {
    describe(`Period: ${period}`, () => {
      test.each(testData)("Depth: %i", (depth, magicNumbers) => {
        const actual = [];
        for (let i = 0; i <= Math.max(...magicNumbers); i++) {
          if (isMagicSerial(period, depth, i)) {
            actual.push(i);
          }
        }
        expect(actual).toEqual(magicNumbers); //
      });
    });
  }
  describePeriod(3, [
    // goes up in 3s, offset by 3^1 + 3^0 = 4
    [1, [4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34, 37, 40, 43, 46, 49, 52]],
    // goes up in 9s, offset by 3^2 + 3^1 + 3^0 = 13
    [2, [13, 22, 31, 40, 49, 58, 67, 76, 85, 94, 103, 112]],
    [3, [40, 67, 94, 121, 148, 175, 202, 229, 256, 283]],
    [4, [121, 202, 283, 364, 445, 526, 607, 688, 769, 850]],
    [5, [364, 607, 850, 1093, 1336, 1579, 1822, 2065, 2308, 2551]],
    [6, [1093, 1822, 2551, 3280, 4009, 4738, 5467, 6196]],
  ]);
  describePeriod(100, [
    [1, [101, 201, 301, 401, 501, 601, 701, 801, 901]],
    [2, [10_101, 20_101, 30_101, 40_101, 50_101, 60_101, 70_101, 80_101]],
    [3, [1_010_101, 2_010_101]],
    // gets a bit too slow at this point
    // [4, [1_010_101, 101010101, 201010101, 301_010_101]],
  ]);
});

function isArrayOfNulls(candidate: unknown): candidate is null[] {
  if (!(candidate instanceof Array)) {
    return false;
  }
  for (const value of candidate) {
    if (value !== null) {
      return false;
    }
  }
  return true;
}

class ArrayOfNulls {
  length: number;
  constructor(length: number) {
    this.length = length;
  }

  equals(other: unknown) {
    return isArrayOfNulls(other) && other.length === this.length;
  }
}

function testIsArrayOfNulls(a: unknown, b: unknown): boolean | undefined {
  if (a instanceof ArrayOfNulls && !(b instanceof ArrayOfNulls)) {
    return a.equals(b);
  } else if (!(a instanceof ArrayOfNulls) && b instanceof ArrayOfNulls) {
    return b.equals(a);
  } else {
    return undefined;
  }
}
expect.addEqualityTesters([testIsArrayOfNulls]);

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
});

describe("stackedHistory", () => {
  beforeAll(() => {
    vi.setSystemTime(new Date("1070-01-01T00:00:00.000Z"));
  });
  afterAll(() => {
    vi.useRealTimers();
  });
  describe("createHistory", () => {
    test.each([3, 4, 5, 6, 100, 1000])(
      "creates an empty history with periodicity %i",
      (period) => {
        const history = createHistory(period);
        expect(history).toEqual({
          stack: {
            deltas: new ArrayOfNulls(period),
            snapshot: "",
            next: null,
          },
          serial: 0,
          periodicity: period,
        });
      },
    );
  });

  test("starts", () => {
    const h1 = createHistory(3);
    const h2 = save(h1, "foo");
    expect(h2).toEqual({
      stack: {
        deltas: [
          null,
          null,
          {
            change: [[1, "foo"]],
            date: "1070-01-01T00:00:00.000Z",
          },
        ],
        snapshot: "foo",
        next: null,
      },
      serial: 1,
      periodicity: 3,
    });
  });
  test("stores a sequence of edits", () => {
    let h = createHistory(3);
    h = save(h, "foo");
    h = save(h, "foobar");
    h = save(h, "bar");
    expect(h).toMatchSnapshot();
  });
  test("stores a sequence of edits onto the next stack", () => {
    let h = createHistory(3);
    h = save(h, "foo");
    h = save(h, "foobar");
    h = save(h, "bar");
    h = save(h, "barbaz");
    expect(h).toMatchSnapshot();
  });
});
