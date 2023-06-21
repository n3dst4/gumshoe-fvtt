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

// remember to update the HMR setup below any time you modify this export.
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
  const themeNames = Object.keys(baseThemes);

  if (import.meta.hot) {
    import.meta.hot.accept(
      [
        "tealTheme.ts",
        "niceTheme.ts",
        "niceThemeDark.ts",
        "highContrastTheme.ts",
        "fearTheme.ts",
        "pallidTheme.ts",
        "deltaGroovyTheme.ts",
        "greenTriangleTheme.ts",
        "antiquarianTheme.ts",
        "olderThanMemoryTheme.ts",
        "unsafeRealityTheme.ts",
      ],
      // keep this list in sync with the exports above.
      // unfortunately the HMP API is staticaly analysed so we can't do anything
      // clever - this *must* be a string literal array in the source code.
      // also this comment should be above the list, but doing so breaks said
      // static analysis.
      (newModules) => {
        newModules.forEach((newModule, i) => {
          if (newModule) {
            const themeName = themeNames[i];
            CONFIG.Investigator?.installTheme(themeName, newModule[themeName]);
            Hooks.call("investigator:themeHMR", themeName);
          }
        });
      },
    );
  }
}
