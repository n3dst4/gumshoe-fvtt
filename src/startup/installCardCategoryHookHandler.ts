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
      const category = settings.cardCategories.get()[0];
      if (
        game.userId !== userId ||
        category === undefined ||
        !isCardItem(item) ||
        item.system.categoryMemberships.length > 0
      ) {
        return;
      }

      // set category
      const updateData: Pick<CardSystemData, "categoryMemberships"> = {
        categoryMemberships: [
          {
            categoryId: category.id,
            nonlethal: false,
            worth: 1,
            useForStyleKey: true,
          },
        ],
      };
      // @ts-expect-error "V10 api"
      item.updateSource({ system: updateData });
    },
  );
};
