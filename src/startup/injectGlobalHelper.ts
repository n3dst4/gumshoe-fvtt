import { baseThemes } from "../themes/baseThemes";

export const injectGlobalHelper = () => {
  CONFIG.Investigator = {
    themes: { ...baseThemes },
  };
};
