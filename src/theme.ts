import { css, SerializedStyles } from "@emotion/react";
import React from "react";
import system from "./system.json";
import { ThemeName } from "./types";

export type Theme = {
  global?: SerializedStyles,
  wallpaper: string,
  bodyFont: string,
  displayFont: string,
  logoGradient: string,
  logoShadows: string,
  logoTransform: string,
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
  global: css`
    @import url("https://fonts.googleapis.com/css2?family=Federo&display=swap");
    @import url('https://fonts.googleapis.com/css2?family=Patrick+Hand+SC&display=swap');
  `,
  wallpaper: `url(systems/${system.name}/assets/wallpaper/marjanblan-5Ft4NWTmeJE-unsplash.webp)`,
  bodyFont: "16px 'Patrick Hand SC', sans-serif",
  displayFont: "normal small-caps normal 1em 'Federo', serif",
  // logo:
  logoGradient: "linear-gradient(135deg, #efb183 0%,#222 30%,#efb183 90%)",
  logoShadows: "2px 0px 1px black, 6px 0px 4px rgba(0,0,0,0.5), -1px 0px 0px rgba(255,255,255,0.5)",
  logoTransform: "rotateY(-30deg) rotateZ(-1deg) translateX(-5%)",
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

export const nightsTheme: Theme = {
  global: css`
    @import url('https://fonts.googleapis.com/css2?family=Unica+One&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Patrick+Hand+SC&display=swap');
  `,
  wallpaper: "linear-gradient(to bottom, #333 0%, #999 100%)",
  bodyFont: "16px 'Patrick Hand SC', sans-serif",
  displayFont: "normal normal normal 1em 'Unica One', serif",
  logoGradient: "linear-gradient(135deg, #f00 0%,#222 30%,#f00 90%)",
  logoShadows: "2px 0px 1px black, -1px 0px 0px rgba(255,255,255,0.5)",
  logoTransform: "scale(90%)",
  colors: {
    accent: "#900",
    glow: "#f00",
    wallpaper: "#333",
    thin: "rgba(255,255,255,0.3)",
    medium: "rgba(255,255,255,0.5)",
    thick: "rgba(255,255,255,0.7)",
    reverseThin: "rgba(0,0,0,0.1)",
    reverseMedium: "rgba(0,0,0,0.3)",
    reverseThick: "rgba(0,0,0,0.5)",
    text: "#433",
  },
};

export const themeDescriptions: {[themeName in ThemeName]: string} = {
  trailTheme: "Trail of Cthulhu",
  nightsTheme: "Night Black Agents",
};

export const themes: {[themeName in ThemeName]: Theme} = {
  trailTheme,
  nightsTheme,
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const ThemeContext = React.createContext<Theme>(trailTheme);
