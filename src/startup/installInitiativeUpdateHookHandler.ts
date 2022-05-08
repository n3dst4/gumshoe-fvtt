import { assertGame } from "../functions";
import { InvestigatorCombatant } from "../module/InvestigatorCombatant";
import { InvestigatorItem } from "../module/InvestigatorItem";
import { InvestigatorItemDataSource } from "../types";

export function installInitiativeUpdateHookHandler () {
  Hooks.on("updateItem", function (
    item: InvestigatorItem,
    dataDiff: DeepPartial<InvestigatorItemDataSource>,
    options: unknown,
    useId: string,
  ) {
    assertGame(game);
    if (game.user?.isGM) {
      //
    }
  });

  // on createCombatant, if you are the user wot done it, set the initiative.
  Hooks.on("createCombatant", (combatant: InvestigatorCombatant, options: any, userId: string) => {
    assertGame(game);
    if (userId !== game.userId) {
      return;
    }
    combatant.doGumshoeInitiative();
  });
}
