/** @jsx jsx */
import { jsx } from "@emotion/react";
import React from "react";
import { settings } from "../../settings";
import { StandardTracker } from "./StandardTracker";
import { TurnPassingCombatTracker } from "./TurnPassingCombatTracker";

export const CombatTrackerSwitch: React.FC = () => {
  const turnPassing = settings.useTurnPassingInitiative.get();
  return (
    turnPassing
      ? <TurnPassingCombatTracker />
      : <StandardTracker/>
  );
};
