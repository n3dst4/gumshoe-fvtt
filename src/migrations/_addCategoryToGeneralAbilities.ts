import { generalAbility, generalAbilityCategories } from "../constants";
import { isNullOrEmptyString } from "../functions";

import system from "../system.json";

export const _addCategoryToGeneralAbilities = (data: any, updateData: any) => {
  if (data.type === generalAbility && isNullOrEmptyString(data.data?.category)) {
    const cat = game.settings
      .get(system.name, generalAbilityCategories)
      .split(",")[0]
      ?.trim();
    if (!cat) {
      throw new Error("No general ability categories found in system settings");
    }
    if (!updateData.data) {
      updateData.data = {};
    }
    updateData.data.category = cat;
  }
  return updateData;
};
