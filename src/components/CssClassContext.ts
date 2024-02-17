import { ThemeSeedV1 } from "@lumphammer/investigator-fvtt-types";
import { createContext } from "react";

import { Mandatory } from "../types";

export type CssClassContextData = keyof Mandatory<
  ThemeSeedV1["notesCssClasses"]
>;

export const CssClassContext = createContext<CssClassContextData | null>(null);
