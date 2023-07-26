import { assertGame } from "../functions/utilities";

export function installKeepTokenImageInSyncWithActor() {
  /*
   * When an actor image is updated, if the prototype token is using the same
   * image as the old actor image, or it's the "cowled figure" image, then
   * update the prototype token to use the new image.
   */
  Hooks.on(
    "preUpdateActor",
    function keepTokenImageInSyncWithActor(
      actor: Actor,
      update: any,
      options: any,
      userId: string,
    ) {
      assertGame(game);
      if (game.userId !== userId || update.img === undefined) {
        return;
      }
      // @ts-expect-error prototypeToken not yetin types
      const token = actor.prototypeToken;
      if (["icons/svg/cowled.svg", actor.img].includes(token.texture.src)) {
        token.update({ texture: { src: update.img } });
      }
    },
  );
}
