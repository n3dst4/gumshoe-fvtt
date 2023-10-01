import { z } from "zod";

import * as c from "../constants";
import { assertGame } from "../functions/utilities";

const getSetting =
  <T = string>(key: string) =>
  (): T => {
    assertGame(game);
    return game.settings.get(c.systemId, key) as T;
  };

const setSetting =
  <T = string>(key: string) =>
  (value: T) => {
    assertGame(game);
    return game.settings.set(c.systemId, key, value);
  };

interface SettingFactoryArgs<T, TValidator extends z.ZodType | undefined> {
  key: string;
  name: string;
  scope?: "world" | "client";
  config?: boolean;
  choices?: (T extends number | string ? Record<T, string> : never) | undefined;
  default: T;
  onChange?: (newVal: T) => void;
  exportable?: boolean;
  validator?: TValidator;
}

interface SettingObject<T, TValidator extends z.ZodType | undefined> {
  key: string;
  get: () => T;
  set: (value: T) => Promise<T>;
  exportable: boolean;
  validator?: TValidator;
}

// type ZodCatchAllType = z.infer<typeof zodCatchAll>;

const createSetting =
  <T>() =>
  <TDefaultValidator extends z.ZodType | undefined = undefined>(
    type: any,
    defaultValidator?: TDefaultValidator,
  ) =>
  <TValidator extends z.ZodTypeAny | undefined = undefined>({
    default: _default,
    key,
    name,
    config = false,
    scope = "world",
    choices,
    onChange,
    exportable = true,
    validator,
  }: SettingFactoryArgs<T, TValidator>): SettingObject<
    T,
    TValidator extends undefined ? TDefaultValidator : TValidator
  > => {
    Hooks.once("init", () => {
      assertGame(game);
      game.settings.register(c.systemId, key, {
        name,
        scope,
        config,
        default: _default,
        type,
        choices,
        onChange,
      });
    });
    return {
      key,
      get: getSetting<T>(key),
      set: setSetting<T>(key),
      exportable,
      // painful - I can't get TS to understand that `=== undefined` corresponds
      // to `extends undefined` in the return type
      validator: (validator === undefined
        ? defaultValidator
        : validator) as TValidator extends undefined
        ? TDefaultValidator
        : TValidator,
    };
  };

// const createSetting = <T, TValidator extends z.ZodType | undefined>(
//   {
//     default: _default,
//     key,
//     name,
//     config = false,
//     scope = "world",
//     choices,
//     onChange,
//     exportable = true,
//     validator,
//   }: SettingFactoryArgs<T>,
//   type: any,
//   defaultValidator?: TValidator,
// ): SettingObject<
//   T,
//   TValidator extends undefined ? typeof zodCatchAll : TValidator
// > => {
//   Hooks.once("init", () => {
//     assertGame(game);
//     game.settings.register(c.systemId, key, {
//       name,
//       scope,
//       config,
//       default: _default,
//       type,
//       choices,
//       onChange,
//     });
//   });
//   return {
//     key,
//     get: getSetting<T>(key),
//     set: setSetting<T>(key),
//     exportable,
//     validator: validator ?? defaultValidator,
//   };
// };

export const createSettingString = createSetting<string>()(String, z.string());

export const myStringSetting = createSettingString<undefined>({
  key: "myStringSetting",
  name: "My string setting",
  default: "default string",
});

export const myStringSetting2 = createSettingString({
  key: "myStringSetting",
  name: "My string setting",
  default: "default string",
  validator: z.enum(["Salmon", "Tuna", "Trout"]),
});

export const createSettingArrayOfString = createSetting<string[]>()(
  Array,
  z.array(z.string()),
);

export const createSettingBoolean = createSetting<boolean>()(
  Boolean,
  z.boolean(),
);

export const createSettingObject = createSetting<Record<string, any>>()(
  Object,
  z.object({}).catchall(z.any()),
);
