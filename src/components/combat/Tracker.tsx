/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { ReactNode } from "react";
import { assertGame, assertNotNull } from "../../functions";
import { settings } from "../../settings";
import { CombatantRow } from "./CombatantRow";
import { TrackerOuter } from "./TrackerOuter";
import { getTurns } from "./getTurns";
import { StandardInitiative } from "./StandardInitiative";

export const Tracker: React.FC = () => {
  assertGame(game);
  assertNotNull(game.user);
  const turnPassing = settings.useTurnPassingInitiative.get();
  const combat = game.combats?.active;
  if (combat === null || combat === undefined) {
    return null;
  }
  const turns = combat ? getTurns(combat) : [];

  return (
    <TrackerOuter>
      {/* ACTUAL COMBATANTS, or "turns" in early-medieval foundry-speak */}
      <ol id="combat-tracker" className="directory-list">
        {
          turns.map<ReactNode>((turn, i) => (
            <CombatantRow key={i} turn={turn} combat={combat}>
              {turnPassing
                ? <StandardInitiative turn={turn} combat={combat}/>
                : <StandardInitiative turn={turn} combat={combat}/>}
            </CombatantRow>
          ))
        }
      </ol>
    </TrackerOuter>
  );
};
