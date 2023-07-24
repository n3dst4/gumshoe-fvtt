import { PickByType } from "../types";
import { describe, it, expectTypeOf } from "vitest";

interface Foo {
  a: number;
  b: string;
  c: string;
}
type PickByTypeOfFooStrings = PickByType<Foo, string>;
type PickByTypeOfFooNumbers = PickByType<Foo, number>;
describe("PickByTypeOfFooStrings", () => {
  it("can be assigned various things", () => {
    expectTypeOf<PickByTypeOfFooStrings>().toMatchTypeOf({});
    expectTypeOf({}).not.toMatchTypeOf<PickByTypeOfFooStrings>();
    expectTypeOf({ a: 1 }).not.toMatchTypeOf<PickByTypeOfFooStrings>();
    expectTypeOf({ a: "1" }).not.toMatchTypeOf<PickByTypeOfFooStrings>();
    expectTypeOf({
      a: "1",
      b: 2,
    }).not.toMatchTypeOf<PickByTypeOfFooStrings>();
    expectTypeOf({
      a: "1",
      b: "2",
    }).not.toMatchTypeOf<PickByTypeOfFooStrings>();
    expectTypeOf({ b: "2", c: "3" }).toMatchTypeOf<PickByTypeOfFooStrings>();
  });
});
describe("PickByTypeOfFooNumbers", () => {
  it("can be assigned various things", () => {
    //
    expectTypeOf<PickByTypeOfFooNumbers>().toMatchTypeOf({});
    expectTypeOf({}).not.toMatchTypeOf<PickByTypeOfFooNumbers>();
    expectTypeOf({ a: 1 }).toMatchTypeOf<PickByTypeOfFooNumbers>();
    expectTypeOf({ a: "1" }).not.toMatchTypeOf<PickByTypeOfFooNumbers>();
    expectTypeOf({
      a: "1",
      b: 2,
    }).not.toMatchTypeOf<PickByTypeOfFooNumbers>();
    expectTypeOf({
      a: "1",
      b: "2",
    }).not.toMatchTypeOf<PickByTypeOfFooNumbers>();
    expectTypeOf({
      b: "2",
      c: "3",
    }).not.toMatchTypeOf<PickByTypeOfFooNumbers>();
  });
});
