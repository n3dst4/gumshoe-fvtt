/* eslint-disable @typescript-eslint/no-unused-vars */
import { RecursivePartial, RecursiveRequired } from "./types";
import { expectAssignable, expectNotAssignable } from "tsd";

// simple types to play with

type Basic = {
  bar: {
    corge: string,
  },
}

type MyFunction = (foo: number) => number;

// -----------------------------------------------------------------------------
// RecursivePartial
type RecursivePartialOfBasic = RecursivePartial<Basic>;

expectAssignable<RecursivePartialOfBasic>({});
expectAssignable<RecursivePartialOfBasic>({ bar: {} });
expectAssignable<RecursivePartialOfBasic>({ bar: { corge: "" } });
expectAssignable<RecursivePartialOfBasic>({ bar: undefined });
expectNotAssignable<RecursivePartialOfBasic>(null);
expectNotAssignable<RecursivePartialOfBasic>(undefined);
expectNotAssignable<RecursivePartialOfBasic>({ bar: null });

type RecursivePartialOfMyFunction = RecursivePartial<MyFunction>;

expectAssignable<RecursivePartialOfMyFunction>((x) => x);
expectNotAssignable<RecursivePartialOfMyFunction>(null);
expectNotAssignable<RecursivePartialOfMyFunction>(undefined);
expectNotAssignable<RecursivePartialOfMyFunction>(() => null);

// -----------------------------------------------------------------------------
// now to try and reverse the spell...

type RecursiveRequiredOfRecursivePartialOfBasic = RecursiveRequired<RecursivePartialOfBasic>;

expectAssignable<RecursiveRequiredOfRecursivePartialOfBasic>({ bar: { corge: "" } });
expectNotAssignable<RecursiveRequiredOfRecursivePartialOfBasic>({});
expectNotAssignable<RecursiveRequiredOfRecursivePartialOfBasic>({ bar: {} });
expectNotAssignable<RecursiveRequiredOfRecursivePartialOfBasic>({ bar: null });
expectNotAssignable<RecursiveRequiredOfRecursivePartialOfBasic>({ bar: undefined });

// -----------------------------------------------------------------------------
// how about an array?

type RecursiveRequiredOfArrayOfRecursivePartialOfBasic = RecursiveRequired<RecursivePartial<Basic>[]>;

expectAssignable<RecursiveRequiredOfArrayOfRecursivePartialOfBasic>([]);
expectAssignable<RecursiveRequiredOfArrayOfRecursivePartialOfBasic>([{ bar: { corge: "" } }]);
expectNotAssignable<RecursiveRequiredOfArrayOfRecursivePartialOfBasic>([{ bar: { } }]);
expectNotAssignable<RecursiveRequiredOfArrayOfRecursivePartialOfBasic>([{ bar: null }]);
expectNotAssignable<RecursiveRequiredOfArrayOfRecursivePartialOfBasic>([{ }]);
expectNotAssignable<RecursiveRequiredOfArrayOfRecursivePartialOfBasic>(undefined);
expectNotAssignable<RecursiveRequiredOfArrayOfRecursivePartialOfBasic>(null);

// -----------------------------------------------------------------------------
// we can go deeper...

type RecursivePartialOfRecursiveRequiredOfRecursiveOfPartialOfBasic = RecursivePartial<RecursiveRequiredOfRecursivePartialOfBasic>;

expectAssignable<RecursivePartialOfRecursiveRequiredOfRecursiveOfPartialOfBasic>({});
expectAssignable<RecursivePartialOfRecursiveRequiredOfRecursiveOfPartialOfBasic>({ bar: {} });
expectAssignable<RecursivePartialOfRecursiveRequiredOfRecursiveOfPartialOfBasic>({ bar: { corge: "" } });
expectAssignable<RecursivePartialOfRecursiveRequiredOfRecursiveOfPartialOfBasic>({ bar: undefined });
expectNotAssignable<RecursivePartialOfRecursiveRequiredOfRecursiveOfPartialOfBasic>(null);
expectNotAssignable<RecursivePartialOfRecursiveRequiredOfRecursiveOfPartialOfBasic>(undefined);
expectNotAssignable<RecursivePartialOfRecursiveRequiredOfRecursiveOfPartialOfBasic>({ bar: null });
