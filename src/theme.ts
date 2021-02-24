import { css, CSSObject, SerializedStyles } from "@emotion/react";
import React from "react";
import { systemName } from "./constants";
import Irid from "irid";

const white = Irid("white");
const black = Irid("black");

export type Theme = {
  displayName: string,
  global?: SerializedStyles,
  wallpaper: string,
  bodyFont?: string,
  displayFont?: string,
  logoGradient: string,
  logoShadows: string,
  logoTransform: string,
  backdropStyle: CSSObject,
  // logo: CSSObject,
  colors: {
    accent: string,
    glow: string,
    wallpaper: string,
    thick: string,
    thin: string,
    medium: string,
    reverseThin: string,
    reverseMedium: string,
    reverseThick: string,
    text: string,
  }
}

export const trailTheme: Theme = {
  displayName: "Trail of Cthulhu",
  global: css`
    @import url("https://fonts.googleapis.com/css2?family=Federo&display=swap");
    @import url('https://fonts.googleapis.com/css2?family=Patrick+Hand+SC&display=swap');
  `,
  wallpaper: `url(systems/${systemName}/assets/wallpaper/marjanblan-5Ft4NWTmeJE-unsplash.webp)`,
  bodyFont: "16px 'Patrick Hand SC', sans-serif",
  displayFont: "normal small-caps normal 1em 'Federo', serif",
  // logo:
  logoGradient: "linear-gradient(135deg, #efb183 0%,#222 30%,#efb183 90%)",
  logoShadows: "2px 0px 1px black, 6px 0px 4px rgba(0,0,0,0.5), -1px 0px 0px rgba(255,255,255,0.5)",
  logoTransform: "rotateY(-30deg) rotateZ(-1deg) translateX(-5%)",
  backdropStyle: {
    perspective: "500px",
    perspectiveOrigin: "50% 50%",
    backgroundImage: "radial-gradient(closest-side, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 100%)",
  },
  colors: {
    accent: "#1d5d5d",
    glow: "#5effff",
    wallpaper: "#ddd",
    thin: "rgba(255,255,255,0.2)",
    medium: "rgba(255,255,255,0.5)",
    thick: "rgba(255,255,255,0.7)",
    reverseThin: "rgba(0,0,0,0.1)",
    reverseMedium: "rgba(0,0,0,0.3)",
    reverseThick: "rgba(0,0,0,0.5)",
    text: "#433",
  },
};

export const nbaThemeDark: Theme = {
  displayName: "Night's Dark Red Agents",
  global: css`
    @import url('https://fonts.googleapis.com/css2?family=Unica+One&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Patrick+Hand+SC&display=swap');
    `,
  //    @import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');
  wallpaper: `url(systems/${systemName}/assets/wallpaper/tina-dawson-Kim9COAIEGc-unsplash-dark-red.webp)`,
  bodyFont: "16px 'Patrick Hand SC', sans-serif",
  displayFont: "normal normal normal 1.1em 'Unica One', serif",
  logoGradient: "linear-gradient(135deg, #fff 0%, #fff 90%)",
  logoShadows: "2px 0px 1px black, -1px 0px 0px rgba(255,255,255,0.5)",
  logoTransform: "scale(0.8)",
  backdropStyle: {
    // background: "linear-gradient(to right, #700 0%, #300 100%)",
    backgroundColor: "rgba(0,0,0,0.4)",
    transform: "scaleY(0.9) scaleX(1.2) translateY(0.1em)",
    zIndex: -1,
    // borderStyle: "solid",
    // borderThickness: "2px 0",
    // borderColor: "#433",
  },
  colors: {
    accent: "#fff",
    glow: "#f33",
    wallpaper: "#4a0d00",
    thin: "rgba(0,0,0,0.2)",
    medium: "rgba(0,0,0,0.4)",
    thick: "rgba(0,0,0,0.6)",
    reverseThin: "rgba(255,255,255,0.1)",
    reverseMedium: "rgba(255,255,255,0.3)",
    reverseThick: "rgba(255,255,255,0.5)",
    text: "#ccc",
  },
};

export const nbaTheme: Theme = {
  displayName: "Nice Light Agents",
  global: css`
    @import url('https://fonts.googleapis.com/css2?family=Unica+One&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Patrick+Hand+SC&display=swap');
  `,
  wallpaper: `url(systems/${systemName}/assets/wallpaper/marjanblan-5Ft4NWTmeJE-unsplash.webp)`,
  bodyFont: "16px 'Patrick Hand SC', sans-serif",
  displayFont: "normal normal normal 1.1em 'Unica One', serif",
  // logo:
  logoGradient: "linear-gradient(135deg, #fff 0%, #fff 90%)",
  logoShadows: "2px 0px 1px black, -1px 0px 0px rgba(255,255,255,0.5)",
  logoTransform: "scale(0.8)",
  backdropStyle: {
    // background: "linear-gradient(to right, #700 0%, #300 100%)",
    background: `#4a0d00 url(systems/${systemName}/assets/wallpaper/tina-dawson-Kim9COAIEGc-unsplash-dark-red.webp)`,
    backgroundSize: "cover",

    transform: "scaleY(0.9) scaleX(1.2) translateY(0.1em)",
    zIndex: -1,
    borderStyle: "solid",
    borderThickness: "2px 0",
    borderColor: "#433",
  },
  colors: {
    accent: "#962121",
    glow: "#ff0000",
    wallpaper: "#ddd",
    thin: "rgba(255,255,255,0.2)",
    medium: "rgba(255,255,255,0.5)",
    thick: "rgba(255,255,255,0.7)",
    reverseThin: "rgba(0,0,0,0.1)",
    reverseMedium: "rgba(0,0,0,0.3)",
    reverseThick: "rgba(0,0,0,0.5)",
    text: "#433",
  },
};

export const highContrastTheme: Theme = {
  displayName: "High Contrast",
  global: css`
  `,
  wallpaper: "",
  bodyFont: "1.2em sans-serif",
  displayFont: "1.2em sans-serif",
  logoGradient: "linear-gradient(135deg, #000 0%, #000 90%)",
  logoShadows: "",
  logoTransform: "none",
  backdropStyle: {
  },
  colors: {
    accent: "#005",
    glow: "#bbf",
    wallpaper: "#ddd",
    thin: white.opacity(0.2).toString(),
    medium: white.opacity(0.4).toString(),
    thick: white.opacity(0.6).toString(),
    reverseThin: black.opacity(0.1).toString(),
    reverseMedium: black.opacity(0.2).toString(),
    reverseThick: black.opacity(0.3).toString(),
    text: "#000",
  },
};

export const themes: {[themeName: string]: Theme} = {
  trailTheme,
  nbaTheme,
  nbaThemeDark,
  highContrastTheme,
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const ThemeContext = React.createContext<Theme>(trailTheme);
