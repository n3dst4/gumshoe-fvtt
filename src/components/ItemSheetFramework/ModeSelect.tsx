import React, { PropsWithChildren } from "react";
import { ModeContext } from "./modeContext";
import { ItemSheetMode } from "./types";
type ModeSelectProps = PropsWithChildren<{
  mode: ItemSheetMode;
}>;

export const ModeSelect: React.FC<ModeSelectProps> = ({ mode, children }) => {
  const currentMode = React.useContext(ModeContext);
  return mode === currentMode ? <>{children}</> : null;
};

ModeSelect.displayName = "ModeSelect";
