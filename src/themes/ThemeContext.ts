import React from "react";
import { tealTheme } from "./tealTheme";
import { Theme } from "./types";

export const ThemeContext = React.createContext<Theme>(tealTheme);
