import { assertGame } from "../functions";
import * as constants from "../constants";
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
            combat.activeTurnPassingCombatant !== combatant.data._id
          ) {
            assertActiveCharacterActor(actor);
            combat.activeTurnPassingCombatant = combatant.data._id;
            combatant.passingTurnsRemaining -= 1;
          }
        },
      );
    }
  });
}
