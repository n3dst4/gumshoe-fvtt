import { baseThemes } from "../themes/baseThemes";
import { themeFactory } from "../themes/functions";

export const injectGlobalHelper = () => {
  CONFIG.Investigator = {
    themes: { ...baseThemes },
    themeFactory,
  };
};
