import { ThemeSeedV1 } from "@lumphammer/investigator-fvtt-types";
import { assertNotNull } from "../functions";
import { baseThemes } from "../themes/baseThemes";
import { themeFactory } from "../themes/functions";

export const injectGlobalHelper = () => {
  CONFIG.Investigator = {
    themes: { ...baseThemes },
    installTheme: (id: string, seed: ThemeSeedV1) => {
      assertNotNull(CONFIG.Investigator);
      CONFIG.Investigator.themes[id] = themeFactory(seed);
    },
  };
};
