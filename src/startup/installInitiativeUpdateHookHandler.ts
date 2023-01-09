import { assertGame } from "../functions";
import { InvestigatorCombatant } from "../module/InvestigatorCombatant";

export function installInitiativeUpdateHookHandler() {
  // on createCombatant, if you are the user wot done it, set the initiative.
  Hooks.on(
    "createCombatant",
    (combatant: InvestigatorCombatant, options: any, userId: string) => {
      assertGame(game);
      if (userId !== game.userId) {
        return;
      }
      combatant.doGumshoeInitiative();
      combatant.resetPassingTurns();
    },
  );
}
