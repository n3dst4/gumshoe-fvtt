import { tealTheme } from "./tealTheme";
import { niceTheme } from "./niceTheme";
import { niceThemeDark } from "./niceThemeDark";
import { highContrastTheme } from "./highContrastTheme";
import { fearTheme } from "./fearTheme";
import { pallidTheme } from "./pallidTheme";
import { deltaGroovyTheme } from "./deltaGroovyTheme";
import { greenTriangleTheme } from "./greenTriangleTheme";
import { antiquarianTheme } from "./antiquarianTheme";
import { olderThanMemoryTheme } from "./olderThanMemoryTheme";
import { ThemeV1 } from "./types";
import { unsafeRealityTheme } from "./unsafeRealityTheme";
// import { systemLogger } from "../functions";

export const baseThemes: { [themeName: string]: ThemeV1 } = {
  tealTheme,
  niceTheme,
  niceThemeDark,
  highContrastTheme,
  fearTheme,
  pallidTheme,
  deltaGroovyTheme,
  greenTriangleTheme,
  antiquarianTheme,
  olderThanMemoryTheme,
  unsafeRealityTheme,
};

export const reregisterBaseTheme = (name: string, theme: ThemeV1) => {
  baseThemes[name] = theme;
};

// HMR for themes
// we can only trigger HMR from the modudule that directly imports the module
// being replaced. we call CONFIG.Investigator?.installTheme to replace it in
// runtime config and then call a (Foundry) hook to notify the (React) useTheme
// hook about the change.
if (import.meta.hot) {
  import.meta.hot.accept("./unsafeRealityTheme.ts", (newModule) => {
    if (newModule) {
      console.info("Updating unsafeRealityTheme", newModule.unsafeRealityTheme);
      CONFIG.Investigator?.installTheme(
        "unsafeRealityTheme",
        newModule.unsafeRealityTheme,
      );
      Hooks.call("investigator:themeHMR", "unsafeRealityTheme");
    }
  });
}
