import React, { useEffect } from "react";
import { runtimeConfig } from "../runtime";
import { tealTheme } from "../themes/tealTheme";
import { ThemeV1 } from "../themes/types";

/**
 * This is the new right way to get a theme from a theme name. It will return a
 * default theme in the event ogf an error, and will also update the theme if it
 * changes in dev using HMR (see baseThemes.ts for where that gets initiated.)
 */
export const useTheme = (name: string) => {
  const [theme, setTheme] = React.useState<ThemeV1>(
    runtimeConfig.themes[name] ?? tealTheme,
  );
  useEffect(() => {
    const fn = (themeName: string) => {
      if (themeName === name) {
        setTheme(runtimeConfig.themes[name] ?? tealTheme);
      }
    };
    Hooks.on("investigator:themeHMR", fn);
    return () => {
      Hooks.off("investigator:themeHMR", fn);
    };
  }, [name]);
  return theme;
};
