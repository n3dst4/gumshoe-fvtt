import { PropsWithChildren, useContext } from "react";

import { ModeContext } from "./modeContext";
import { ItemSheetMode } from "./types";
type ModeSelectProps = PropsWithChildren<{
  mode: ItemSheetMode;
}>;

export const ModeSelect = ({ mode, children }: ModeSelectProps) => {
  const currentMode = useContext(ModeContext);
  return mode === currentMode ? <>{children}</> : null;
};

ModeSelect.displayName = "ModeSelect";
