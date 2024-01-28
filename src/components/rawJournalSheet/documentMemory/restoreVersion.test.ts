import { expect, test, vi } from "vitest";

import { createDocumentMemory } from "./createDocumentMemory";
import { restoreVersion } from "./restoreVersion";
import { save } from "./save";
import { advanceTime10s } from "./testHelpers";

// these are the serial numbers which should be restorable
const validVersions: number[] = [
  243, 486, 648, 729, 810, 891, 918, 945, 963, 972, 981, 990, 993, 996, 998,
  999, 1000,
];

// I'm not typing this bad boy out
const invalidVersions = new Array(1002)
  .fill(0)
  .map((_, i) => i)
  .filter((i) => !validVersions.includes(i));

// fill the memory
vi.setSystemTime(new Date(0));
let memory = createDocumentMemory(3);

for (let i = 1; i <= 1000; i++) {
  memory = save(memory, `${i}`);
  advanceTime10s();
}

// a couple of manual tests
test("restoring a valid version 1000", () => {
  expect(restoreVersion(memory, 1000)).toBe("1000");
});

test("restoring a valid version 648", () => {
  expect(restoreVersion(memory, 648)).toBe("648");
});

test("restoring an invalid version throws", () => {
  expect.assertions(invalidVersions.length);
  for (const serial of invalidVersions) {
    expect(() => restoreVersion(memory, serial)).toThrow();
  }
});

test.each(validVersions)("restore version %i", (serial) => {
  const restored = restoreVersion(memory, serial);
  expect(restored).toBe(`${serial}`);
});
