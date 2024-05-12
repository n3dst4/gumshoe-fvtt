import { averiaLibre } from "./constants";
import { themeFactory } from "./functions";
import { ThemeV1 } from "./types";

const bg1 = "#e2e3e4";
const bg2 = "#ececed";
const accent = "#258";
const accentTrans = "#2587";

export const mutantCityBlueTheme: ThemeV1 = themeFactory({
  schemaVersion: "v1",
  displayName: "Mutant City Blue",
  global: `
  @import url('https://fonts.googleapis.com/css2?family=Russo+One&display=swap');    ${averiaLibre.importStatement}
  `,
  largeSheetRootStyle: {
    backgroundImage: `
      radial-gradient(closest-side, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 100%),
      repeating-linear-gradient(45deg, ${bg1} 0px, ${bg1} 20px, ${bg2} 20px, ${bg2} 40px)
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
  colors: {
    accent,
    accentContrast: "white",
    glow: "#5effff",
    wallpaper: "#ddd",
    backgroundSecondary: "rgba(255,255,255,0.2)",
    backgroundPrimary: "rgba(255,255,255,0.5)",
    backgroundButton: "rgba(0,0,0,0.1)",
    text: "#433",
  },
});
