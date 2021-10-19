import { css } from "@emotion/react";
import { systemName } from "../constants";
import { themeFactory } from "./functions";
import { Theme } from "./types";

export const tealTheme: Theme = themeFactory({
  schemaVersion: "v1",
  displayName: "Teal of Cthulhu",
  global: css`
    @import url("https://fonts.googleapis.com/css2?family=Federo&display=swap");
    @import url('https://fonts.googleapis.com/css2?family=Patrick+Hand+SC&display=swap');
  `,
  largeSheetRootStyle: {
    backgroundImage: `url(systems/${systemName}/assets/wallpaper/marjanblan-5Ft4NWTmeJE-unsplash.webp)`,
  },
  smallSheetRootStyle: {
    backgroundImage: `url(systems/${systemName}/assets/wallpaper/marjanblan-5Ft4NWTmeJE-unsplash.webp)`,
  },
  bodyFont: "16px 'Patrick Hand SC', sans-serif",
  displayFont: "normal small-caps normal 1em 'Federo', serif",
  logo: {
    frontTextElementStyle: {
      background: "linear-gradient(135deg, #efb183 0%,#222 30%,#efb183 90%)",
      backgroundClip: "text",
    },
    rearTextElementStyle: {
      textShadow: "2px 0px 1px black, 6px 0px 4px rgba(0,0,0,0.5), -1px 0px 0px rgba(255,255,255,0.5)",
    },
    textElementsStyle: {
      transform: "rotateY(-30deg) rotateZ(-1deg) translateX(-5%)",
    },
    backdropStyle: {
      perspective: "500px",
      perspectiveOrigin: "50% 50%",
      backgroundImage: "radial-gradient(closest-side, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 100%)",
    },
  },
  colors: {
    accent: "#1d5d5d",
    accentContrast: "white",
    glow: "#5effff",
    wallpaper: "#ddd",
    bgTransSecondary: "rgba(255,255,255,0.2)",
    bgTransPrimary: "rgba(255,255,255,0.5)",
    bgTint: "rgba(0,0,0,0.1)",
    text: "#433",
  },
});
