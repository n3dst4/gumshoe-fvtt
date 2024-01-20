import { describe, expect, test } from "vitest";

import { calculateOffset, isMagicSerial } from "./stackedHistory";

describe("calculateOffset", () => {
  test("works", () => {
    expect(calculateOffset(3, 1)).toBe(1);
    expect(calculateOffset(3, 2)).toBe(4);
    expect(calculateOffset(3, 3)).toBe(13);
    expect(calculateOffset(3, 4)).toBe(40);
    expect(calculateOffset(3, 5)).toBe(121);
    expect(calculateOffset(100, 1)).toBe(1);
    expect(calculateOffset(100, 2)).toBe(101);
    expect(calculateOffset(100, 3)).toBe(10101);
    expect(calculateOffset(100, 4)).toBe(1010101);
  });
});

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

describe("isMagicSerial", () => {
  describePeriod(3, [
    [
      1,
      [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34, 37, 40, 43, 46, 49, 52], // 3
    ],
    [2, [4, 13, 22, 31, 40, 49, 58, 67, 76, 85, 94, 103, 112]], // 9
    [3, [13, 40, 67, 94, 121, 148, 175, 202, 229, 256, 283]], // 27
    [4, [40, 121, 202, 283, 364, 445, 526, 607, 688, 769, 850]], // 81
    [5, [121, 364, 607, 850, 1093, 1336, 1579, 1822, 2065, 2308, 2551]], // 243
    [6, [364, 1093, 1822, 2551, 3280, 4009, 4738, 5467, 6196]], // 729
  ]);
  describePeriod(100, [
    [1, [1, 101, 201, 301, 401, 501, 601, 701, 801, 901]],
    [2, [101, 10_101, 20_101, 30_101, 40_101, 50_101, 60_101, 70_101, 80_101]],
    [3, [10101, 1_010_101, 2_010_101]],
    // gets a bit too slow at this point
    // [4, [1_010_101, 101010101, 201010101, 301_010_101]],
  ]);
});
