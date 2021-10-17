import { css } from "@emotion/react";
import Irid from "irid";
import { themeFactory } from "./functions";
import { Theme } from "./types";

const white = Irid("white");
const black = Irid("black");

export const highContrastTheme: Theme = themeFactory({
  schemaVersion: "v1",
  displayName: "High Contrast",
  global: css`
  `,
  largeSheetRootStyle: {
  },
  smallSheetRootStyle: {
  },
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
    bgTransSecondary: white.opacity(0.7).toString(),
    bgTransPrimary: white.opacity(0.9).toString(),
    bgTint: black.opacity(0.1).toString(),
    text: "#000",
    textMuted: "#111",
  },
});
