import { assertGame } from "../functions/utilities";
import { settings } from "../settings/settings";
import { CardSystemData } from "../types";
import { isCardItem } from "../v10Types";

export const installCardCategoryHookHandler = () => {
  Hooks.on(
    "preCreateItem",
    async (
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
        !isCardItem(item)
      ) {
        return;
      }

      // set first category
      if (item.system.categoryMemberships.length === 0) {
        const updateData: Pick<
          CardSystemData,
          "categoryMemberships" | "styleKeyCategoryId"
        > = {
          categoryMemberships: [
            {
              categoryId: category.id,
              nonlethal: false,
              worth: 1,
            },
          ],
          styleKeyCategoryId: category.id,
        };
        // @ts-expect-error "V10 api"
        await item.updateSource({ system: updateData });
      }
    },
  );
};
