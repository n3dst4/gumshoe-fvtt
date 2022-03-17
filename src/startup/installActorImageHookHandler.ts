import { npcIcon, partyIcon, pcIcon } from "../constants";
import { assertGame, isNullOrEmptyString } from "../functions";
import { isNPCDataSource, isPartyDataSource, isPCDataSource } from "../types";

export const installActorImageHookHandler = () => {
  Hooks.on(
    "preCreateActor",
    (
      actor: Actor,
      createData: { name: string, type: string, data?: any, img?: string },
      options: any,
      userId: string,
    ) => {
      assertGame(game);
      if (game.userId !== userId) return;

      // set image
      if (
        isNullOrEmptyString(actor.data.img) ||
        actor.data.img === "icons/svg/mystery-man.svg"
      ) {
        actor.data.update({
          img: isPCDataSource(actor.data)
            ? pcIcon
            : isNPCDataSource(actor.data)
              ? npcIcon
              : isPartyDataSource(actor.data)
                ? partyIcon
                : undefined,
        });
      }
    },
  );
};
