import { assertGame } from "../functions";
import { settings } from "../settings";
import { isEquipmentDataSource } from "../typeAssertions";

export const installEquipmentCategoryHookHandler = () => {
  Hooks.on(
    "preCreateItem",
    (
      item: Item,
      createData: { name: string, type: string, data?: any, img?: string },
      options: any,
      userId: string,
    ) => {
      assertGame(game);
      if (game.userId !== userId) return;

      // set image
      if (
        isEquipmentDataSource(item.data)
      ) {
        const equipmentCategories = settings.equipmentCategories.get();
        const category = Object.keys(equipmentCategories)[0];
        item.data.update({
          data: {
            category,
          },
        });
      }
    },
  );
};
