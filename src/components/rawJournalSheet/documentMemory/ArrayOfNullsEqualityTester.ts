import { expect } from "vitest";

/**
 * The actual function that tells if something is an array of nulls of a given
 * length.
 */
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

/**
 * Tester for use in Vitest or Jest. Matches an array of nulls of the given
 * length.
 *
 * ```ts
 * expect(value).toEqual(new ArrayOfNulls(3));
 * expect(value).toEqual({ foo: "bar", baz: new ArrayOfNulls(3)});
 * ```
 */
export class ArrayOfNulls {
  length: number;
  constructor(length: number) {
    this.length = length;
  }

  equals(other: unknown) {
    return isArrayOfNulls(other) && other.length === this.length;
  }
}

/**
 * This function gets registered with Vitest's `expect`. It gets run for every
 * pairwise comparison when testing equality. Returns a boolean if if either a
 * or b is an ArrayOfNulls, otherwise undefined (passes matching onto the next
 * matcher or built-in matching.)
 *
 * Some examples in the docs show the case of having two macther objects
 * compared to each other and I can't see how that would ever happen?
 */
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
