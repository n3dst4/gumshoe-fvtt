import { z } from "zod";

import * as c from "../constants";
import { assertGame } from "../functions/utilities";

interface SettingFactoryArgs<T> {
  key: string;
  name: string;
  scope?: "world" | "client";
  config?: boolean;
  choices?: (T extends number | string ? Record<T, string> : never) | undefined;
  default: T;
  onChange?: (newVal: T) => void;
  exportable?: boolean;
  validator?: z.ZodTypeAny;
}

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

const createSetting = <T>(
  {
    default: _default,
    key,
    name,
    config = false,
    scope = "world",
    choices,
    onChange,
    exportable = true,
    validator,
  }: SettingFactoryArgs<T>,
  type: any,
  defaultValidator?: z.ZodTypeAny,
) => {
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
    validator: validator ?? defaultValidator,
  };
};

export const createSettingString = (args: SettingFactoryArgs<string>) =>
  createSetting(args, String, z.string());

export const createSettingArrayOfString = (
  args: SettingFactoryArgs<string[]>,
) => createSetting(args, Array, z.array(z.string()));

export const createSettingBoolean = (args: SettingFactoryArgs<boolean>) =>
  createSetting(args, Boolean, z.boolean());

export const createSettingObject = <T>(args: SettingFactoryArgs<T>) =>
  createSetting<T>(args, Object, z.object({}).catchall(z.any()));
