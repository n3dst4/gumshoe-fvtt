import { css } from "@emotion/react";
import { systemName } from "../constants";
import { themeFactory } from "./functions";
import { Theme } from "./types";

const numRepeats = 5;
const colors = [
  "#f4e83f",
  "#a06f18",
  "#b78d6c",
  "#cc7171",
  "#ebaa4b",
  "#e47005",
  "#ed9907",
];
const numColors = colors.length;
const wedge = 360 / (numRepeats * numColors);
const gradientParts = [
  `${colors[0]} ${wedge}deg`,
  ...(colors
    .slice(1)
    .map((color, i) => `${color} ${wedge * i}deg ${wedge * (i + 1)}deg`)),
].join(", ");

const gradient = `repeating-conic-gradient(${gradientParts})`;

export const deltaGroovyTheme: Theme = themeFactory({
  schemaVersion: "v1",
  displayName: "Delta Groovy",
  global: css`
    @import url('https://fonts.googleapis.com/css2?family=Patrick+Hand+SC&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Spicy+Rice&display=swap');    
  `,
  largeSheetRootStyle: {
    backgroundImage: `url(systems/${systemName}/assets/wallpaper/stil-wtqe5nd5MYk-unsplash.webp)`,
  },
  smallSheetRootStyle: {
    backgroundImage: `url(systems/${systemName}/assets/wallpaper/stil-wtqe5nd5MYk-unsplash.webp)`,
  },
  bodyFont: "16px 'Patrick Hand SC', sans-serif",
  displayFont: "normal normal normal 1.1em 'Spicy Rice', serif",
  logo: {
    frontTextElementStyle: {
      background: "#fff",
      backgroundClip: "text",
    },
    rearTextElementStyle: {
      textShadow:
      // "0 0 0.3em #fff, " +
      "-0.01em -0.01em 0 #000, " +
      "0.01em 0.01em 0 #000, " +
      "0.1em  0.1em  0 #d22fe5ff, " +
      "0.11em 0.11em 0 #000, " +
      "0.2em 0.2em 0 #e5762fff, " +
      "0.21em 0.21em 0 #000 " +
      // "0.3em 0.3em 0 #a9c47c" +
      ""
      ,
    },
    textElementsStyle: {
      transform: "translateY(-0.1em)",
    },
    backdropStyle: {
      backgroundColor: "#293417",
      backgroundImage: gradient,
      maskImage: "linear-gradient(rgba(0, 0, 0, 1.0), transparent)",
      margin: "-50em",
    },
  },
  colors: {
    accent: "#801d8c ",
    accentContrast: "white",
    glow: "#fff",
    wallpaper: "#b6b3b3", //
    bgTransSecondary: "rgba(255,255,255,0.2)",
    bgTransPrimary: "rgba(255,255,255,0.5)",
    bgTint: "rgba(0,0,0,0.1)",
    text: "#444",
    textMuted: "#666",
  },
});
