import { ThemeSeedV1 } from "@lumphammer/investigator-fvtt-types";

import { averiaLibre } from "./constants";
import { createBasicTabStyle, themeFactory } from "./functions";
import { tealTheme } from "./tealTheme";
import { ThemeV1 } from "./types";

const stripe1 = "#e2e3e9";
const stripe2 = "#ececed";

const shadowBase = "#000000";
const shadow1 = `${shadowBase}17`;
const shadow2 = `${shadowBase}00`;

const colors: ThemeSeedV1["colors"] = {
  accent: "#005d89",
  accentContrast: "white",
  glow: "#5effff",
  wallpaper: "#ddd",
  backgroundSecondary: "#9992",
  backgroundPrimary: "#fff7",
  backgroundButton: "rgba(0,0,0,0.1)",
  text: "#433",
};

const accentTrans = `${colors.accent}77`;

export const mutantCityBlueTheme: ThemeV1 = themeFactory({
  schemaVersion: "v1",
  displayName: "Mutant City Blue",
  global: `
    @import url('https://fonts.googleapis.com/css2?family=Russo+One&display=swap');
    ${averiaLibre.importStatement}
  `,
  largeSheetRootStyle: {
    backgroundImage: `
      radial-gradient(
        farthest-corner,
        #fffb 0%,
        #fffb 50%,
        #fff0 100%
      ),
      repeating-linear-gradient(45deg, ${stripe1} 0px, ${stripe1} 20px, ${stripe2} 20px, ${stripe2} 40px)
    `,
  },
  bodyFont: averiaLibre.fontFamily,
  displayFont: "normal normal normal 1em 'Russo One', serif",
  logo: {
    frontTextElementStyle: {
      background: `repeating-linear-gradient(180deg, ${accentTrans} 0,${accentTrans} 2px, ${colors.accent} 2px, ${colors.accent} 4px)`,
      // filter: "blur(0.5px)",
      backgroundClip: "text",
    },
    rearTextElementStyle: {
      // display: "none",
      textShadow: "2px 0px 1px white, 6px 0px 4px #fff7, -1px 0px 0px #fff7",
    },
    textElementsStyle: {
      // transform: "rotateY(-30deg) rotateZ(-1deg) translateX(-5%)",
      font: "normal normal normal 1em 'Russo One', serif",
    },
    backdropStyle: {
      perspective: "500px",
      perspectiveOrigin: "50% 50%",
      backgroundImage:
        "radial-gradient(closest-side, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 100%)",
    },
  },
  tabStyle: {
    ...createBasicTabStyle(colors),
    color: colors.accent,
    border: `1px solid ${colors.accent}`,
    backgroundColor: colors.backgroundSecondary,
    backgroundImage: `linear-gradient(to top, ${shadow1} 0%, ${shadow1} 10%, ${shadow2} 10%)`,
  },
  tabActiveStyle: {
    ...tealTheme.tabActiveStyle,
    borderBottomStyle: "none",
  },
  tabSpacerStyle: {
    ...tealTheme.tabSpacerStyle,
    borderBottom: `1px solid ${colors.accent}`,
  },
  panelStylePrimary: {
    ...tealTheme.panelStylePrimary,
    border: `1px solid ${colors.accent}`,
    // borderStyle: "none solid solid solid",
  },
  tabContentStyle: {
    ...tealTheme.panelStylePrimary,
    border: `1px solid ${colors.accent}`,
    borderStyle: "none solid solid solid",
  },
  colors,
});
