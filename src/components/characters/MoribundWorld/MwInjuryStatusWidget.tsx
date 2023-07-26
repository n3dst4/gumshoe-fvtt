import React, { useEffect, useState } from "react";

import { getTranslated } from "../../../functions/functionsThatUseSettings";
import { assertGame } from "../../../functions/utilities";
import { MwInjuryStatus } from "../../../types";

interface MwInjuryStatusWidgetProps {
  status: MwInjuryStatus;
  setStatus: (status: MwInjuryStatus) => Promise<void>;
}

export const MwInjuryStatusWidget: React.FC<MwInjuryStatusWidgetProps> = ({
  status,
  setStatus,
}: MwInjuryStatusWidgetProps) => {
  assertGame(game);

  const [display, setDisplay] = useState(status);

  useEffect(() => {
    setStatus(display);
  }, [display, setStatus]);

  const color =
    display === MwInjuryStatus.uninjured
      ? "#0f07"
      : display === MwInjuryStatus.hurt
      ? "#770f"
      : display === MwInjuryStatus.down ||
        display === MwInjuryStatus.unconscious
      ? "#950f"
      : // dead
        "#f00f";

  return (
    <div
      css={{
        padding: "0.5em 0 1em 0",
        backgroundImage: `radial-gradient(closest-side, ${color}, #0000)`,
      }}
    >
      <div
        css={{
          fontSize: "0.8em",
        }}
      >
        Injury Status
      </div>
      <select
        css={{
          width: "100%",
        }}
        value={display}
        onChange={(e) => {
          setDisplay(e.currentTarget.value as MwInjuryStatus);
        }}
      >
        <option value={MwInjuryStatus.uninjured}>
          {getTranslated("Uninjured")}
        </option>
        <option value={MwInjuryStatus.hurt}>{getTranslated("Hurt")}</option>
        <option value={MwInjuryStatus.down}>{getTranslated("Down")}</option>
        <option value={MwInjuryStatus.unconscious}>
          {getTranslated("Unconscious")}
        </option>
        <option value={MwInjuryStatus.dead}>{getTranslated("Dead")}</option>
      </select>
    </div>
  );
};
