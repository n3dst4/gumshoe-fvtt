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

// a nest of factories! I'll walk you through it...
const createSetting =
  // first factory allows us to inject TSetting, the main type of the setting


    <TSetting>() =>
    // second factory allows us to inject TDefaultValidator, the type of the
    // default validator for this setting factory. it's separate from the first
    // one so we can be explicit about TSetting but uise inference for
    // TDefaultValidator
    <TDefaultValidator extends z.ZodType | undefined = undefined>(
      type: any,
      defaultValidator?: TDefaultValidator,
    ) =>
    // third factory allows us to inject TSpecific, an opportunity to override
    // TSetting for this specific setting
    <TSpecific = TSetting>() =>
    // finally, the actual function that creates the setting. the args (see
    // SettingFactoryArgs<...> and SettingObject<...> at the end of the
    // signature) for this function are based on TSpecific and TValidator, which
    // fall back to TSetting and TDefaultValidator respecively because of all
    // these nested factories.
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
    }: SettingFactoryArgs<TSpecific, TValidator>): SettingObject<
      TSpecific,
      TValidator extends undefined ? TDefaultValidator : TValidator
    > => {
      Hooks.once("init", () => {
        assertGame(game);
        // the actual foundry setting is registered here
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
        get: getSetting<TSpecific>(key),
        set: setSetting<TSpecific>(key),
        exportable,
        // a bit painful - I can't get TS to understand that `=== undefined` corresponds
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

/**
 * Creates a setting object with a string value.
 */
// three nested factories, so we need three sets of parentheses. the first one
// is how we inject the type of the setting. the second one is where we supply
// the "type" that foundry wants and the default validator. the third one would be an opportunity
// to override the type of the setting, but we don't need that here. note that would could export
export const createSettingString = createSetting<string>()(
  String,
  z.string(),
)();

// export const myStringSetting = createSettingString<undefined>({
//   key: "myStringSetting",
//   name: "My string setting",
//   default: "default string",
// });

// export const myStringSetting2 = createSettingString({
//   key: "myStringSetting",
//   name: "My string setting",
//   default: "default string",
//   validator: z.enum(["Salmon", "Tuna", "Trout"]),
// });

export const createSettingArrayOfString = createSetting<string[]>()(
  Array,
  z.array(z.string()),
)();

export const createSettingBoolean = createSetting<boolean>()(
  Boolean,
  z.boolean(),
)();

export const createSettingObjectT = createSetting<Record<string, any>>()(
  Object,
  z.object({}).catchall(z.any()),
);

export const createSettingObject = createSettingObjectT();
