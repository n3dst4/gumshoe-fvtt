import { css } from "@emotion/react";
import { systemName } from "../constants";
import { themeFactory } from "./functions";
import { ThemeV1 } from "@lumphammer/investigator-fvtt-types";

export const niceTheme: ThemeV1 = themeFactory({
  schemaVersion: "v1",
  displayName: "Nice Light Agents",
  global: css`
    @import url('https://fonts.googleapis.com/css2?family=Unica+One&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Patrick+Hand+SC&display=swap');
  `,
  largeSheetRootStyle: {
    backgroundImage: `url(systems/${systemName}/assets/wallpaper/marjanblan-5Ft4NWTmeJE-unsplash.webp)`,
  },
  bodyFont: "16px 'Patrick Hand SC', sans-serif",
  displayFont: "normal normal normal 1.1em 'Unica One', serif",
  logo: {
    frontTextElementStyle: {
      color: "#fff",
    },
    rearTextElementStyle: {
      textShadow: "2px 0px 1px black, -1px 0px 0px rgba(255,255,255,0.5)",
    },
    textElementsStyle: {
      transform: "scale(0.8)",
    },
    backdropStyle: {
      background: `#4a0d00 url(systems/${systemName}/assets/wallpaper/nice_red_agents.webp)`,
      backgroundSize: "cover",
      transform: "scaleY(0.9) scaleX(1.2) translateY(0.1em)",
      zIndex: -1,
      borderStyle: "solid",
      borderThickness: "2px 0",
      borderColor: "#433",
    },
  },
  colors: {
    accent: "#962121",
    accentContrast: "white",
    glow: "#ff0000",
    wallpaper: "#ddd",
    backgroundSecondary: "rgba(255,255,255,0.2)",
    backgroundPrimary: "rgba(255,255,255,0.5)",
    backgroundButton: "rgba(0,0,0,0.1)",
    text: "#433",
  },
});
