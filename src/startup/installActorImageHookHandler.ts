import { npcIcon, partyIcon, pcIcon } from "../constants";
import { assertGame, isNullOrEmptyString } from "../functions";
import { isNPCActor, isPartyActor, isPCActor } from "../v10Types";

export const installActorImageHookHandler = () => {
  Hooks.on(
    "preCreateActor",
    (
      actor: Actor,
      createData: { name: string; type: string; img?: string },
      options: any,
      userId: string,
    ) => {
      assertGame(game);
      if (game.userId !== userId) return;

      // set image
      if (
        isNullOrEmptyString(actor.img) ||
        actor.img === "icons/svg/mystery-man.svg"
      ) {
        actor.update({
          img: isPCActor(actor)
            ? pcIcon
            : isNPCActor(actor)
            ? npcIcon
            : isPartyActor(actor)
            ? partyIcon
            : undefined,
        });
      }
    },
  );
};
