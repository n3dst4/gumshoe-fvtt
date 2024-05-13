import { averiaLibre } from "./constants";
import { themeFactory } from "./functions";
import { tealTheme } from "./tealTheme";
import { ThemeV1 } from "./types";

const stripe1 = "#e2e3e4";
const stripe2 = "#ececed";
const accent = "#005d89";
const accentTrans = `${accent}77`;
const backgroundSecondary = "#9992";
const backgroundPrimary = "#fff7";

export const mutantCityBlueTheme: ThemeV1 = themeFactory({
  schemaVersion: "v1",
  displayName: "Mutant City Blue",
  global: `
  @import url('https://fonts.googleapis.com/css2?family=Russo+One&display=swap');    ${averiaLibre.importStatement}
  `,
  largeSheetRootStyle: {
    backgroundImage: `
      radial-gradient(closest-side, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 100%),
      repeating-linear-gradient(45deg, ${stripe1} 0px, ${stripe1} 20px, ${stripe2} 20px, ${stripe2} 40px)
    `,
  },
  bodyFont: averiaLibre.fontFamily,
  displayFont: "normal normal normal 1em 'Russo One', serif",
  logo: {
    frontTextElementStyle: {
      background: `repeating-linear-gradient(180deg, ${accentTrans} 0,${accentTrans} 2px, ${accent} 2px, ${accent} 4px)`,
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
    ...tealTheme.tabStyle,
    border: `1px solid ${accent}`,
    backgroundColor: backgroundSecondary,
    backgroundImage: "linear-gradient(to top, #3332 0%, #3330 20%)",
  },
  tabActiveStyle: {
    ...tealTheme.tabActiveStyle,
    borderBottomStyle: "none",
  },
  tabSpacerStyle: {
    ...tealTheme.tabSpacerStyle,
    borderBottom: `1px solid ${accent}`,
  },
  panelStylePrimary: {
    ...tealTheme.panelStylePrimary,
    border: `1px solid ${accent}`,
    borderStyle: "none solid solid solid",
  },
  colors: {
    accent,
    accentContrast: "white",
    glow: "#5effff",
    wallpaper: "#ddd",
    backgroundSecondary,
    backgroundPrimary,
    backgroundButton: "rgba(0,0,0,0.1)",
    text: "#433",
  },
});
