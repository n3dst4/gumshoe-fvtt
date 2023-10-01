import { occupationSlotIndex, pc } from "../constants";
import { assertGame } from "../functions/utilities";
import { InvestigatorActor } from "../module/InvestigatorActor";

export function installNewCharacterDefaultOccupationHookHandler() {
  Hooks.on(
    "createActor",
    async (
      actor: InvestigatorActor,
      options: Record<string, unknown>,
      userId: string,
    ) => {
      assertGame(game);
      if (game.userId !== userId) return;

      if (actor.type !== pc) {
        return;
      }

      const existingOccupation = actor.getOccupations();
      if (existingOccupation.length > 0) {
        return;
      }

      await actor.createPersonalDetail(occupationSlotIndex, false);
    },
  );
}
