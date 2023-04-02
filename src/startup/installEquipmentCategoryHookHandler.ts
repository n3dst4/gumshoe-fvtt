import { assertGame } from "../functions";
import { settings } from "../settings";
import { isEquipmentDataSource } from "../typeAssertions";
import { EquipmentDataSource } from "../types";

export const installEquipmentCategoryHookHandler = () => {
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

      // set category and fields
      if (isEquipmentDataSource(item.data)) {
        const equipmentCategories = settings.equipmentCategories.get();
        const categoryId =
          item.system.category || Object.keys(equipmentCategories)[0];
        const updateData: Pick<
          EquipmentDataSource["data"],
          "category" | "fields"
        > = {
          category: item.system.category || categoryId,
          fields: item.system.fields || {},
        };
        const fields = equipmentCategories[categoryId].fields;
        for (const field in fields) {
          updateData.fields[field] ||= fields[field].default;
        }
        // @ts-expect-error "V10 api"
        item.updateSource({ system: updateData });
      }
    },
  );
};
