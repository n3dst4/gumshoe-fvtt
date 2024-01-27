import { describe, expect, test } from "vitest";

import { getAdditiveStates } from "./testHelpers";

describe("getAdditiveStates", () => {
  test.each(new Array(9).fill(null).map((_, i) => i + 1))(
    "getStates: %i states",
    (i) => {
      expect(getAdditiveStates(i)).toMatchSnapshot();
    },
  );
  test.each([0, -1, -100, 27, 100])(
    "getStates: %i states should throw",
    (i) => {
      expect(() => getAdditiveStates(i)).toThrow();
    },
  );
});
