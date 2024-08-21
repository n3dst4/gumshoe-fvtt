import { getTranslated } from "../functions/getTranslated";
import { assertGame } from "../functions/utilities";
import { isPCActor } from "../v10Types";

// /src/foundry/common/data/data.mjs/chatMessageData.d.ts
export function installEquipmentAddedNotifier() {
  Hooks.on("createItem", async (item: Item, opts: unknown, userId: string) => {
    assertGame(game);
    const isNotOwned = !item.parent && isPCActor(item.parent);
    const gameHasNoUsers = !game.users;

    if (isNotOwned || gameHasNoUsers) {
      return;
    }

    if (game.userId !== userId) return;

    const recipientIds = (game.users ?? [])
      .filter((user) => {
        const hasPermission = item.testUserPermission(
          user,
          // @ts-expect-error types are wrong
          CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER,
          { exact: false },
        );
        const isNotMe = user.id !== game.user?.id;
        return hasPermission && isNotMe;
      })
      .map((user) => user.id);

    const proms = recipientIds.map((recipientId) => {
      return ChatMessage.create(
        {
          author: game.user?.id,
          speaker: ChatMessage.getSpeaker({
            alias: game.user?.name ?? "",
          }),
          content: getTranslated("ItemNameAddedToActorName", {
            ItemName: item.name ?? "",
            ActorName: item.parent?.name ?? "",
          }),
          whisper: [recipientId],
        },
        {},
      );
    });

    await Promise.all(proms);
  });
}
