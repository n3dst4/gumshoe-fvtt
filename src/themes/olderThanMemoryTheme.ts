import { css } from "@emotion/react";
import { systemName } from "../constants";
import { themeFactory } from "./functions";
import { Theme } from "./types";

const glow = "#fda994";

export const olderThanMemoryTheme: Theme = themeFactory({
  schemaVersion: "v1",
  displayName: "Older Than Memory",
  global: css`
    @import url('https://fonts.googleapis.com/css2?family=Patrick+Hand+SC&display=swap');
  `,
  largeSheetRootStyle: {
    backgroundImage: `url(systems/${systemName}/assets/wallpaper/red_sands.jpg)`,
    backgroundPosition: "top",
    backgroundSize: "cover",
  },
  smallSheetRootStyle: {
    backgroundImage: `linear-gradient( to right, #0009,#0009), url(systems/${systemName}/assets/wallpaper/red_sands.jpg)`,
    backgroundPosition: "center",
    backgroundSize: "cpver",
  },
  appWindowStyle: {
    boxShadow: `0 0 20px ${glow}`,
  },
  bodyFont: "16px 'Patrick Hand SC', sans-serif",
  displayFont: "normal small-caps normal 1.1em 'Longdon Decorative Regular', serif",
  logo: {
    fontScaleFactor: 24,
    frontTextElementStyle: {
      color: "#fff",
      // maskImage: `url(systems/${systemName}/assets/wallpaper/annie-spratt-UR2DMIFuc5c-unsplash.webp)`,
      // maskMode: "luminance",
      // maskRepeat: "repeat",
      // maskSize: "contain",
      textShadow: [
        `0 0 0.5em ${glow}`,
        `0 0 0.2em ${glow}`,
        `0 0 1em ${glow}`,
        `0 0 2em ${glow}`,
      ].join(", "),
    },
    rearTextElementStyle: {
      // display: "none",
      border: `2px solid ${glow}`,
      borderRadius: "3em",
      boxShadow: [
        `0 0 0.5em 0 inset ${glow}`,
        `0 0 0.5em 0 ${glow}`,
      ].join(","),
      backgroundImage: [
        `radial-gradient(closest-side, ${glow}77 0%, ${glow}00 100%)`,
        "linear-gradient(to bottom, #6667, #0007)",
      ].join(", "),
      padding: "0.1em",
    },
    textElementsStyle: {
      transform: "scale(0.6)",
      fontWeight: "bold",
    },
    backdropStyle: {

    },
  },
  colors: {
    accent: "#fc8e72",
    accentContrast: "#333",
    glow,
    wallpaper: "#333",
    backgroundPrimary: "#111c",
    backgroundSecondary: "#1119",
    backgroundButton: "rgba(0,0,0,0.1)",
    text: "#ccc", // "#9ad6de",
  },
});
