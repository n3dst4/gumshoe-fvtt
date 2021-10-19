import { css } from "@emotion/react";
import { systemName } from "../constants";
import { themeFactory } from "./functions";
import { Theme } from "./types";

export const niceThemeDark: Theme = themeFactory({
  schemaVersion: "v1",
  displayName: "Nice Dark Red Agents",
  global: css`
    @import url('https://fonts.googleapis.com/css2?family=Unica+One&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Patrick+Hand+SC&display=swap');
  `,
  largeSheetRootStyle: {
    backgroundImage: `url(systems/${systemName}/assets/wallpaper/nice_red_agents.webp)`,
  },
  smallSheetRootStyle: {
    backgroundImage: `linear-gradient( to right, #0002,#0002), url(systems/${systemName}/assets/wallpaper/nice_red_agents.webp)`,
  },
  appWindowStyle: {
    boxShadow: "0 0 20px #f00",
  },
  bodyFont: "16px 'Patrick Hand SC', sans-serif",
  displayFont: "normal normal normal 1.1em 'Unica One', serif",
  logo: {
    frontTextElementStyle: {
      background: "linear-gradient(135deg, #fff 0%, #fff 90%)",
      backgroundClip: "text",
    },
    rearTextElementStyle: {
      textShadow: "2px 0px 1px black, -1px 0px 0px rgba(255,255,255,0.5)",
    },
    textElementsStyle: {
      transform: "scale(0.8)",
    },
    backdropStyle: {
      backgroundColor: "rgba(0,0,0,0.4)",
      transform: "scaleY(0.9) scaleX(1.2) translateY(0.1em)",
      zIndex: -1,
    },
  },
  colors: {
    accent: "#fff",
    accentContrast: "#600",
    glow: "#f33",
    wallpaper: "#4a0d00",
    danger: "yellow",

    backgroundSecondary: "#0004",
    backgroundPrimary: "#0007",

    // bgTransDangerPrimary: "rgba(255,128,0,0.2)",
    // bgTransDangerSecondary: "rgba(255,128,0,0.3)",

    backgroundButton: "rgba(255,255,255,0.1)",
    text: "#ccc",
  },
});
