import { Irid } from "../Irid";
import { themeFactory } from "./functions";
import { ThemeV1 } from "./types";

const white = Irid("white");
const black = Irid("black");

export const highContrastTheme: ThemeV1 = themeFactory({
  schemaVersion: "v1",
  displayName: "High Contrast",
  global: "",
  largeSheetRootStyle: {},
  bodyFont: "1.1em sans-serif",
  displayFont: "1.1em sans-serif",
  logo: {
    frontTextElementStyle: {
      color: "#000",
    },
    rearTextElementStyle: {
      display: "none",
    },
    textElementsStyle: {
      transform: "none",
    },
    backdropStyle: {
      background: "white",
    },
  },
  colors: {
    accent: "#005",
    accentContrast: "white",
    glow: "#bbf",
    wallpaper: "#666",
    backgroundSecondary: white.opacity(0.7).toString(),
    backgroundPrimary: white.opacity(0.9).toString(),
    backgroundButton: black.opacity(0.1).toString(),
    text: "#000",
  },
});
