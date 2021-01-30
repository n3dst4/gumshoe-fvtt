import React from "react";
import system from "./system.json";

type Theme = {
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
    darken: string,
    text: string,
  }
}

export const trailTheme: Theme = {
  wallpaper: `url(systems/${system.name}/assets/wallpaper/marjanblan-5Ft4NWTmeJE-unsplash.jpg)`,
  bodyFont: "16px 'Patrick Hand SC', sans-serif",
  // italic small-caps bold 16px/2 cursive
  displayFont: "normal small-caps normal 1em 'Federo', serif",
  colors: {
    accent: "#1d5d5d",
    glow: "#5effff",
    wallpaper: "#ddd",
    medium: "rgba(255,255,255,0.5)",
    thick: "rgba(255,255,255,0.7)",
    thin: "rgba(255,255,255,0.2)",
    darken: "rgba(0,0,0,0.3)",
    text: "#433",
  },
};

export type ThemeSetter = (theme: Theme) => void;
export type ThemeTuple = [Theme, ThemeSetter];

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const ThemeContext = React.createContext<ThemeTuple>([trailTheme, (theme) => {}]);
