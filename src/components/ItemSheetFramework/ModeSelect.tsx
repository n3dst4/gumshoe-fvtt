import React, { PropsWithChildren } from "react";
import { ModeContext } from "./modeContext";
type ModeSelectProps = PropsWithChildren<{
  mode: string;
}>;

export const ModeSelect: React.FC<ModeSelectProps> = ({ mode, children }) => {
  const currentMode = React.useContext(ModeContext);
  return mode === currentMode ? <>{children}</> : null;
};

ModeSelect.displayName = "ModeSelect";
