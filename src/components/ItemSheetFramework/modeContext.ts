import { createContext } from "react";

import { ItemSheetMode } from "./types";

export const ModeContext = createContext<ItemSheetMode>(ItemSheetMode.Main);
