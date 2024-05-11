import { systemId } from "../constants";
import { themeFactory } from "./functions";
import { ThemeV1 } from "./types";

export const mutantCityBlueTheme: ThemeV1 = themeFactory({
  schemaVersion: "v1",
  displayName: "Mutant City Blue",
  global: `
  @import url('https://fonts.googleapis.com/css2?family=Julius+Sans+One&family=Playfair:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Patrick+Hand+SC&display=swap');
  `,
  largeSheetRootStyle: {
    backgroundImage: `url("systems/${systemId}/assets/wallpaper/mcb wallpaper.webp")`,
  },
  bodyFont: "16px 'Patrick Hand SC', sans-serif",
  displayFont: "normal small-caps normal 1em 'Julius Sans One', serif",
  logo: {
    frontTextElementStyle: {
      background: "linear-gradient(135deg, #efb183 0%,#222 30%,#efb183 90%)",
      backgroundClip: "text",
    },
    rearTextElementStyle: {
      textShadow:
        "2px 0px 1px black, 6px 0px 4px rgba(0,0,0,0.5), -1px 0px 0px rgba(255,255,255,0.5)",
    },
    textElementsStyle: {
      // transform: "rotateY(-30deg) rotateZ(-1deg) translateX(-5%)",
    },
    backdropStyle: {
      perspective: "500px",
      perspectiveOrigin: "50% 50%",
      backgroundImage:
        "radial-gradient(closest-side, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 100%)",
    },
  },
  colors: {
    accent: "#28a",
    accentContrast: "white",
    glow: "#5effff",
    wallpaper: "#ddd",
    backgroundSecondary: "rgba(255,255,255,0.2)",
    backgroundPrimary: "rgba(255,255,255,0.5)",
    backgroundButton: "rgba(0,0,0,0.1)",
    text: "#433",
  },
});
