import { describe, expect, test } from "vitest";

import { ArrayOfNulls } from "./ArrayOfNullsEqualityTester";
import { createDocumentMemory } from "./createDocumentMemory";

describe("createDocumentMemory", () => {
  test.each([3, 4, 5, 6, 100, 1000])(
    "creates an empty memory with period %i and no maxDepth",
    (period) => {
      const memory = createDocumentMemory(period);
      expect(memory).toEqual({
        stack: {
          edits: new ArrayOfNulls(period),
          snapshot: "",
          next: null,
          lastPushSnapshot: "",
        },
        serial: 0,
        period,
        maxDepth: null,
        snapshot: "",
      });
    },
  );
  test.each([3, 4, 5, 6, 100, 1000])(
    "creates an empty memory with period %i and no maxDepth",
    (period) => {
      const memory = createDocumentMemory(period, 10);
      expect(memory).toEqual({
        stack: {
          edits: new ArrayOfNulls(period),
          snapshot: "",
          next: null,
          lastPushSnapshot: "",
        },
        serial: 0,
        period,
        maxDepth: 10,
        snapshot: "",
      });
    },
  );
});
