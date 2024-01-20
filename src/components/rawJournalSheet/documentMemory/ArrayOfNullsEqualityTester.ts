import { expect } from "vitest";

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

export class ArrayOfNulls {
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
