/** @jsx jsx */
import { jsx } from "@emotion/react";
import React from "react";
import { settings } from "../../settings";
import { StandardCombatTracker } from "./StandardCombatTracker";
import { TurnPassingCombatTracker } from "./TurnPassingCombatTracker";

export const CombatTrackerSwitch: React.FC = () => {
  const turnPassing = settings.useTurnPassingInitiative.get();
  return (
    turnPassing
      ? <TurnPassingCombatTracker />
      : <StandardCombatTracker/>
  );
};
