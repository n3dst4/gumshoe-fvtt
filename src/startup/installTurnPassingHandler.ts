import { assertGame } from "../functions";
import * as constants from "../constants";
import { assertActiveCharacterDataSource, RequestTurnPassArgs } from "../types";

export function installTurnPassingHandler () {
  Hooks.once("ready", () => {
    assertGame(game);
    if (game.user?.isGM) {
      logger.log("turnPassingHandler - installing handler");
      Hooks.on(constants.requestTurnPass, ({ combatantId, userId }: RequestTurnPassArgs) => {
        logger.log({ combatantId, userId });
        assertGame(game);
        const combat = game.combat;
        const combatant = combat?.combatants.get(combatantId);
        const actor = combatant?.actor;
        if (actor && combat && combatant && combatant.passingTurnsRemaining > 0 && combat.activeTurnPassingCombatant !== combatant.data._id) {
          assertActiveCharacterDataSource(actor?.data);
          combat.activeTurnPassingCombatant = combatant.data._id;
          combatant.passingTurnsRemaining -= 1;
        }
      });
    }
  });
}
