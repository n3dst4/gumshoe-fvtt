import { EquipmentFieldMetadata } from "@lumphammer/investigator-fvtt-types";
import { assertNumericFieldOkayness } from "./reducerTools";
import { describe, it, expect } from "vitest";

type ErrorTestTuple = [
  string,
  EquipmentFieldMetadata | undefined,
  string,
  unknown | undefined,
  string,
];

type OkayTestTuple = [
  string,
  EquipmentFieldMetadata | undefined,
  string,
  unknown | undefined,
];

describe("assertNumericFieldOkayness", () => {
  it.each<ErrorTestTuple>([
    ["undefined field", undefined, "foo", undefined, "No field with id foo"],
    [
      "non-numeric field",
      { type: "string", default: "", name: "" },
      "foo",
      undefined,
      "Cannot set min/max on field type string",
    ],
    [
      "non-numeric value",
      { type: "number", default: 0, name: "" },
      "foo",
      "bar",
      "Invalid value bar for field ",
    ],
  ])("%s", (name, field, id, value) => {
    expect(() => {
      assertNumericFieldOkayness(field, id, value);
    }).toThrow();
  });

  it.each<OkayTestTuple>([
    ["numeric value", { type: "number", default: 0, name: "" }, "foo", 3],
    [
      "undefined value",
      { type: "number", default: 0, name: "" },
      "foo",
      undefined,
    ],
  ])("%s", (name, field, id, value) => {
    expect(() => {
      assertNumericFieldOkayness(field, id, value);
    }).not.toThrow();
  });
});
