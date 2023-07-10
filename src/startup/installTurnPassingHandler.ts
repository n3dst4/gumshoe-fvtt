import { assertGame, systemLogger } from "../functions";
import * as constants from "../constants";
import { InitiativeActionArgs } from "../types";
import { assertActiveCharacterActor } from "../v10Types";

export function installTurnPassingHandler() {
  Hooks.once("ready", () => {
    assertGame(game);
    if (game.user?.isGM) {
      Hooks.on(
        constants.requestTurnPass,
        ({ combatantId }: InitiativeActionArgs) => {
          assertGame(game);
          const combat = game.combat;
          const combatant = combat?.combatants.get(combatantId);
          const actor = combatant?.actor;
          if (
            actor &&
            combat &&
            combatant &&
            combatant.passingTurnsRemaining > 0 &&
            // @ts-expect-error V10 types
            combat.activeTurnPassingCombatant !== combatant._id
          ) {
            assertActiveCharacterActor(actor);
            // @ts-expect-error V10 types
            combat.activeTurnPassingCombatant = combatant._id;
            combatant.passingTurnsRemaining -= 1;
          }
        },
      );
      Hooks.on(
        constants.jumpInInitiative,
        ({ combatantId }: InitiativeActionArgs) => {
          assertGame(game);
          const combatant = game?.combat?.combatants.get(combatantId);
          if (combatant) {
            combatant.jumpIn();
          } else {
            systemLogger.log(
              `jumpInInitiative - combatant ${combatantId} not found`,
            );
          }
        },
      );
    }
  });
}
