/** @jsx jsx */
import { jsx } from "@emotion/react";
import React from "react";
import { InvestigatorCombatTrackerBase } from "../../module/InvestigatorCombatTracker";

interface CombatTrackerProps {
  foundryApplication: InvestigatorCombatTrackerBase;
}

export const CombatTrackerDisplay: React.FC<CombatTrackerProps> = ({
  foundryApplication,
}: CombatTrackerProps) => {
  return (
    <div>
      Combat Tracker
    </div>
  );
};
