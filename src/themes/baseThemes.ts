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
import { ThemeV1 } from "investigator-fvtt-types";

export const baseThemes: {[themeName: string]: ThemeV1} = {
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
};
