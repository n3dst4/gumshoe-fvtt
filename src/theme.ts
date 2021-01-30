import React from "react";

type Theme = {
  accentColor: string,
}

export const trailTheme: Theme = {
  accentColor: "#1d5d5d",
};

export type ThemeSetter = (theme: Theme) => void;
export type ThemeTuple = [Theme, ThemeSetter];

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const ThemeContext = React.createContext<ThemeTuple>([trailTheme, (theme) => {}]);
