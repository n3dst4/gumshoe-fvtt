import { css } from "@emotion/react";
import { ThemeMakerV1 } from "investigator-fvtt-types";
import { assertNotNull } from "../functions";
import { baseThemes } from "../themes/baseThemes";
import { themeFactory } from "../themes/functions";

export const injectGlobalHelper = () => {
  CONFIG.Investigator = {
    themes: { ...baseThemes },
    installTheme: (id: string, maker: ThemeMakerV1) => {
      assertNotNull(CONFIG.Investigator);
      const seed = maker(css);
      CONFIG.Investigator.themes[id] = themeFactory(seed);
    },
  };
};
