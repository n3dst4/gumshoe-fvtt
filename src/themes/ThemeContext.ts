import React from "react";

import { tealTheme } from "./tealTheme";
import { ThemeV1 } from "./types";

export const ThemeContext = React.createContext<ThemeV1>(tealTheme);
