import { assertGame } from "../functions/utilities";
import { settings } from "../settings/settings";
import { CardSystemData } from "../types";
import { isCardItem } from "../v10Types";

export const installCardCategoryHookHandler = () => {
  Hooks.on(
    "preCreateItem",
    (
      item: Item,
      createData: { name: string; type: string; data?: any; img?: string },
      options: any,
      userId: string,
    ) => {
      assertGame(game);
      if (game.userId !== userId) return;

      // set category
      if (isCardItem(item)) {
        const cardCategories = settings.cardCategories.get();
        const categoryId = cardCategories[0]?.id;
        const updateData: Pick<CardSystemData, "categoryId"> = {
          categoryId: item.system.categoryId || categoryId,
        };
        // @ts-expect-error "V10 api"
        item.updateSource({ system: updateData });
      }
    },
  );
};
