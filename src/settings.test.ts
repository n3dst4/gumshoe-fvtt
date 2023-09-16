import { describe, expect, it } from "vitest";

import { createSettingObject, settings } from "./settings";

describe("createSettingObject", () => {
  it("should return a default validator", () => {
    expect(true).toBe(true);
    const setting = createSettingObject({
      key: "test",
      name: "Test",
      default: { a: 1 },
    });
    expect(setting.validator).toBeDefined();
    expect(setting.validator?.parse({ a: 1 })).toEqual({ a: 1 });
    expect(() => setting.validator?.parse(null)).toThrow();
    expect(() => setting.validator?.parse(5)).toThrow();
    expect(() => setting.validator?.parse("")).toThrow();
  });
});

describe("settings", () => {
  describe("personalDetails", () => {
    it("should be an array of strings", () => {
      const validator = settings.personalDetails.validator;
      expect(validator).toBeDefined();
      expect(validator?.parse([])).toEqual([]);
      expect(validator?.parse([{ name: "foo", type: "item" }])).toEqual([
        { name: "foo", type: "item" },
      ]);
      expect(validator?.parse([{ name: "foo", type: "text" }])).toEqual([
        { name: "foo", type: "text" },
      ]);
      expect(
        () => validator?.parse([{ name: "foo", type: "potato" }]),
      ).toThrow();
      expect(() => validator?.parse([{ name: "foo", type: 5 }])).toThrow();
      expect(() => validator?.parse([{ name: "foo", type: null }])).toThrow();
      expect(() => validator?.parse([{ name: "foo" }])).toThrow();
      expect(() => validator?.parse([{ type: "text" }])).toThrow();
      expect(() => validator?.parse([{ name: 5, type: "text" }])).toThrow();
      expect(() => validator?.parse([{ name: null, type: "text" }])).toThrow();
      expect(() => validator?.parse({ name: "foo", type: "text" })).toThrow();
    });
  });
  describe("statsVaildator", () => {
    it.each(["pcStats", "npcStats"])("should validate %s", (key) => {
      const validator = settings[key as keyof typeof settings].validator;
      expect(validator).toBeDefined();
      expect(validator?.parse({})).toEqual({});
      expect(
        validator?.parse({
          foo: {
            name: "Foo",
            default: 3,
          },
        }),
      ).toEqual({
        foo: {
          name: "Foo",
          default: 3,
        },
      });
      expect(
        validator?.parse({
          foo: {
            name: "Foo",
            default: 3,
          },
          bar: {
            name: "Bar",
            default: 5,
          },
        }),
      ).toEqual({
        foo: {
          name: "Foo",
          default: 3,
        },
        bar: {
          name: "Bar",
          default: 5,
        },
      });
      expect(
        () =>
          validator?.parse({
            name: "Foo",
            default: 3,
          }),
      ).toThrow();
      expect(
        () =>
          validator?.parse({
            foo: {
              default: 3,
            },
          }),
      ).toThrow();
      expect(
        () =>
          validator?.parse({
            foo: {
              name: "Foo",
            },
          }),
      ).toThrow();
      expect(() => validator?.parse(null)).toThrow();
      expect(() => validator?.parse(5)).toThrow();
    });
  });
});
