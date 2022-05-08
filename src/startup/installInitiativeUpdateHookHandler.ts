import { assertGame } from "../functions";
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
}
