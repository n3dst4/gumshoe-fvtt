/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { ReactNode } from "react";
import { assertGame, assertNotNull } from "../../functions";
import { CombatantRow } from "./CombatantRow";
import { getTurns } from "./getTurns";
import { CombatTrackerOuter } from "./CombatTrackerOuter";

/**
 * React component for standard Investigator combat tracker.
 */
export const StandardTracker: React.FC = () => {
  assertGame(game);
  assertNotNull(game.user);

  const combat = game.combats?.active;
  const turns = combat ? getTurns(combat) : [];

  if (combat === null) {
    return null;
  }

  return (
    <CombatTrackerOuter>
      {/* ACTUAL COMBATANTS, or "turns" in early-medieval foundry-speak */}
      <ol id="combat-tracker" className="directory-list">
        {turns.map<ReactNode>((turn, i) => (
          <CombatantRow key={i} turn={turn} combat={combat} />
        ))}
      </ol>
    </CombatTrackerOuter>
  );
};
