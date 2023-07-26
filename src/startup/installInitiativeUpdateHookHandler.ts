import { assertGame } from "../functions/utilities";
import { InvestigatorCombatant } from "../module/InvestigatorCombatant";
import { settings } from "../settings";

export function installInitiativeUpdateHookHandler() {
  // on createCombatant, if you are the user wot done it, set the initiative.
  Hooks.on(
    "createCombatant",
    (combatant: InvestigatorCombatant, options: any, userId: string) => {
      assertGame(game);
      if (userId !== game.userId) {
        return;
      }
      if (settings.useTurnPassingInitiative.get()) {
        combatant.resetPassingTurns();
      } else {
        combatant.doGumshoeInitiative();
      }
    },
  );
}
