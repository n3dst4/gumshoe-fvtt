/** @jsx jsx */
import { jsx } from "@emotion/react";
import React from "react";
import { MwInjuryStatus } from "../../types";

interface MwInjuryStatusWidgetProps {
  status: MwInjuryStatus;
}

export const MwInjuryStatusWidget: React.FC<MwInjuryStatusWidgetProps> = ({
  status,
}: MwInjuryStatusWidgetProps) => {
  return (
    <div>MW Injury Status: {status}</div>
  );
};
