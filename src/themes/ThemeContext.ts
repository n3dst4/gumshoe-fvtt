import React from "react";
import { tealTheme } from "./tealTheme";
import { ThemeV1 } from "investigator-fvtt-types";

export const ThemeContext = React.createContext<ThemeV1>(tealTheme);
