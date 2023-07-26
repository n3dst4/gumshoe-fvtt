import * as constants from "../constants";
import { assertGame } from "../functions/utilities";
import { RequestTurnPassArgs } from "../types";
import { assertActiveCharacterActor } from "../v10Types";

export function installTurnPassingHandler() {
  Hooks.once("ready", () => {
    assertGame(game);
    if (game.user?.isGM) {
      Hooks.on(
        constants.requestTurnPass,
        ({ combatantId }: RequestTurnPassArgs) => {
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
    }
  });
}
