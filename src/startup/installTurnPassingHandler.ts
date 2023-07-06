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
          const combat = game.combat;
          const combatant = combat?.combatants.get(combatantId);
          const actor = combatant?.actor;
          if (!(actor && combat && combatant)) {
            return;
          }
          assertActiveCharacterActor(actor);
          // bail out if the combatant has already gone this round
          const thisCombatantIndex = combat.turns.findIndex(
            (turn) => turn.id === combatantId,
          );
          const activeCombatantIndex = combat.turn;
          if (thisCombatantIndex <= (activeCombatantIndex ?? 0)) {
            systemLogger.log("jumpInInitiative - combatant already gone");
            return;
          }
          const activeCombatantId = combat.turns[activeCombatantIndex ?? 0].id;
          // if (activeCombatant.initiative === null) {

          combatant.jumpInBeforeId = activeCombatantId ?? undefined;
          // combatant.
          // work out fake initiative
          //     find the active combatant
          //     use their initiative
          //     get curent jump-in counter

          // @ts-expect-error V10 types
          combat.activeTurnPassingCombatant = combatant._id;
          combatant.passingTurnsRemaining -= 1;
        },
      );
    }
  });
}
