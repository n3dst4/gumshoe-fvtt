import { expect, it } from "vitest";

import ashenStarsExport from "./test_data/ashen_stars_export.json";
import { validateImportedSettings } from "./validateImportedSettings";

it("should validate valid settings", () => {
  const validatedResult = validateImportedSettings(
    JSON.stringify(ashenStarsExport),
  );
  expect(validatedResult).toEqual(ashenStarsExport);
});

it("should validate an empty object", () => {
  const validatedResult = validateImportedSettings("{}");
  expect(validatedResult).toEqual({});
});

it("should throw an error if the settings are the wrong type", () => {
  expect(() =>
    validateImportedSettings(
      JSON.stringify({ ...ashenStarsExport, npcStats: "not an object" }),
    ),
  ).toThrowErrorMatchingInlineSnapshot(
    '"Validation error: Expected object, received string at \\"npcStats\\""',
  );
});

it("should throw an error if there is an unknown key", () => {
  expect(() =>
    validateImportedSettings(
      JSON.stringify({ ...ashenStarsExport, unknownKey: "unknown value" }),
    ),
  ).toThrowErrorMatchingInlineSnapshot(
    "\"Validation error: Unrecognized key(s) in object: 'unknownKey'\"",
  );
});

it("should throw an error if the text is not JSON", () => {
  expect(() =>
    validateImportedSettings("not json"),
  ).toThrowErrorMatchingInlineSnapshot(
    '"Unexpected token o in JSON at position 1"',
  );
});
