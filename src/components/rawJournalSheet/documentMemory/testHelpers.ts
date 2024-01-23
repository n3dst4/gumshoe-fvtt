import { vi } from "vitest";

export const epoch = 0;

const twentyStates = [
  "a",
  "ab",
  "abc",
  "abcd",
  "abcde",
  "abcdef",
  "abcdefg",
  "abcdefgh",
  "abcdefghi",
  "abcdefghij",
  "abcdefghijk",
  "abcdefghijkl",
  "abcdefghijklm",
  "abcdefghijklmn",
  "abcdefghijklmno",
  "abcdefghijklmnop",
  "abcdefghijklmnopq",
  "abcdefghijklmnopqr",
  "abcdefghijklmnopqrs",
  "abcdefghijklmnopqrst",
];

export const getStates = (n: number) => twentyStates.slice(0, n);

export function advanceTime10s() {
  vi.setSystemTime(new Date().setSeconds(new Date().getSeconds() + 10));
}
