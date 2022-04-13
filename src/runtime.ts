import { PresetV1, ThemeV1 } from "@lumphammer/investigator-fvtt-types";
import { basePresets } from "./presets";
import { baseThemes } from "./themes/baseThemes";

export interface RuntimeConfig {
  themes: {
    [name: string]: ThemeV1,
  };
  presets: {
    [name: string]: PresetV1,
  };
}

export const runtimeConfig: RuntimeConfig = {
  themes: { ...baseThemes },
  presets: { ...basePresets },
};
