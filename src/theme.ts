import { css, SerializedStyles } from "@emotion/react";
import React from "react";
import system from "./system.json";
import { ThemeName } from "./types";

export type Theme = {
  global?: SerializedStyles,
  wallpaper: string,
  bodyFont: string,
  displayFont: string,
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
  colors: {
    accent: "#1d5d5d",
    glow: "#5effff",
    wallpaper: "#ddd",
    medium: "rgba(255,255,255,0.5)",
    thick: "rgba(255,255,255,0.7)",
    thin: "rgba(255,255,255,0.2)",
    reverseThin: "rgba(0,0,0,0.1)",
    reverseMedium: "rgba(0,0,0,0.3)",
    reverseThick: "rgba(0,0,0,0.5)",
    text: "#433",
  },
};

export const nightsTheme: Theme = {
  global: css`
    @import url("https://fonts.googleapis.com/css2?family=Federo&display=swap");
    @import url('https://fonts.googleapis.com/css2?family=Patrick+Hand+SC&display=swap');
  `,
  wallpaper: `url(systems/${system.name}/assets/wallpaper/elti-meshau-2S2F2exmbhw-unsplash.webp)`,
  bodyFont: "16px 'Patrick Hand SC', sans-serif",
  displayFont: "normal small-caps normal 1em 'Federo', serif",
  colors: {
    accent: "#900",
    glow: "#f40",
    wallpaper: "#ddd",
    medium: "rgba(0,0,0,0.5)",
    thick: "rgba(0,0,0,0.7)",
    thin: "rgba(0,0,0,0.2)",
    reverseThin: "rgba(255,255,255,0.1)",
    reverseMedium: "rgba(255,255,255,0.3)",
    reverseThick: "rgba(255,255,255,0.5)",
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
