import { describe, expectTypeOf,it } from "vitest";

import { RecursivePartial, RecursiveRequired } from "../types";

// I've broken this out into a separate file because I was seeing some odd hangs
// when running vitest typecheck with multiple `describe` blocks in the same
// file.

// simple types to play with
type Basic = {
  bar: {
    corge: string;
  };
};

type MyFunction = (foo: number) => number;

type RecursivePartialOfBasic = RecursivePartial<Basic>;
describe("RecursivePartialOfBasic", () => {
  it("can be assigned various things", () => {
    expectTypeOf<RecursivePartialOfBasic>().toMatchTypeOf({});
    expectTypeOf({}).toMatchTypeOf<RecursivePartialOfBasic>();
    expectTypeOf({ bar: {} }).toMatchTypeOf<RecursivePartialOfBasic>();
    expectTypeOf({
      bar: { corge: "" },
    }).toMatchTypeOf<RecursivePartialOfBasic>();
    expectTypeOf({ bar: undefined }).toMatchTypeOf<RecursivePartialOfBasic>();
    expectTypeOf(null).not.toMatchTypeOf<RecursivePartialOfBasic>();
    expectTypeOf(undefined).not.toMatchTypeOf<RecursivePartialOfBasic>();
    expectTypeOf({ bar: null }).not.toMatchTypeOf<RecursivePartialOfBasic>();
  });
});

type RecursivePartialOfMyFunction = RecursivePartial<MyFunction>;

describe("RecursivePartial on a function", () => {
  it("can be assigned {}", () => {
    expectTypeOf(
      (x: number) => x,
    ).toMatchTypeOf<RecursivePartialOfMyFunction>();
    expectTypeOf(null).not.toMatchTypeOf<RecursivePartialOfMyFunction>();
    expectTypeOf(undefined).not.toMatchTypeOf<RecursivePartialOfMyFunction>();
    expectTypeOf(() => null).not.toMatchTypeOf<RecursivePartialOfMyFunction>();
  });
});

// -----------------------------------------------------------------------------
// now to try and reverse the spell...
type RecursiveRequiredOfRecursivePartialOfBasic =
  RecursiveRequired<RecursivePartialOfBasic>;
describe("RecursiveRequiredOfRecursivePartialOfBasic", () => {
  expectTypeOf({
    bar: { corge: "" },
  }).toMatchTypeOf<RecursiveRequiredOfRecursivePartialOfBasic>();
  expectTypeOf(
    {},
  ).not.toMatchTypeOf<RecursiveRequiredOfRecursivePartialOfBasic>();
  expectTypeOf({
    bar: {},
  }).not.toMatchTypeOf<RecursiveRequiredOfRecursivePartialOfBasic>();
  expectTypeOf({
    bar: null,
  }).not.toMatchTypeOf<RecursiveRequiredOfRecursivePartialOfBasic>();
  expectTypeOf({
    bar: undefined,
  }).not.toMatchTypeOf<RecursiveRequiredOfRecursivePartialOfBasic>();
});

// -----------------------------------------------------------------------------
// how about an array?
type RecursiveRequiredOfArrayOfRecursivePartialOfBasic = RecursiveRequired<
  RecursivePartial<Basic>[]
>;

describe("RecursiveRequiredOfArrayOfRecursivePartialOfBasic", () => {
  expectTypeOf(
    [],
  ).toMatchTypeOf<RecursiveRequiredOfArrayOfRecursivePartialOfBasic>();
  expectTypeOf([
    { bar: { corge: "" } },
  ]).toMatchTypeOf<RecursiveRequiredOfArrayOfRecursivePartialOfBasic>();
  expectTypeOf([
    { bar: {} },
  ]).not.toMatchTypeOf<RecursiveRequiredOfArrayOfRecursivePartialOfBasic>();
  expectTypeOf([
    { bar: null },
  ]).not.toMatchTypeOf<RecursiveRequiredOfArrayOfRecursivePartialOfBasic>();
  expectTypeOf([
    {},
  ]).not.toMatchTypeOf<RecursiveRequiredOfArrayOfRecursivePartialOfBasic>();
  expectTypeOf(
    undefined,
  ).not.toMatchTypeOf<RecursiveRequiredOfArrayOfRecursivePartialOfBasic>();
  expectTypeOf(
    null,
  ).not.toMatchTypeOf<RecursiveRequiredOfArrayOfRecursivePartialOfBasic>();
});

// -----------------------------------------------------------------------------
// we can go deeper...
type RecursivePartialOfRecursiveRequiredOfRecursiveOfPartialOfBasic =
  RecursivePartial<RecursiveRequiredOfRecursivePartialOfBasic>;

describe("RecursivePartialOfRecursiveRequiredOfRecursiveOfPartialOfBasic", () => {
  expectTypeOf(
    {},
  ).toMatchTypeOf<RecursivePartialOfRecursiveRequiredOfRecursiveOfPartialOfBasic>();
  expectTypeOf({
    bar: {},
  }).toMatchTypeOf<RecursivePartialOfRecursiveRequiredOfRecursiveOfPartialOfBasic>();
  expectTypeOf({
    bar: { corge: "" },
  }).toMatchTypeOf<RecursivePartialOfRecursiveRequiredOfRecursiveOfPartialOfBasic>();
  expectTypeOf({
    bar: undefined,
  }).toMatchTypeOf<RecursivePartialOfRecursiveRequiredOfRecursiveOfPartialOfBasic>();
  expectTypeOf(
    null,
  ).not.toMatchTypeOf<RecursivePartialOfRecursiveRequiredOfRecursiveOfPartialOfBasic>();
  expectTypeOf(
    undefined,
  ).not.toMatchTypeOf<RecursivePartialOfRecursiveRequiredOfRecursiveOfPartialOfBasic>();
  expectTypeOf({
    bar: null,
  }).not.toMatchTypeOf<RecursivePartialOfRecursiveRequiredOfRecursiveOfPartialOfBasic>();
});
