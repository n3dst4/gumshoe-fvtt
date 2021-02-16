import { generalAbility } from "../constants";
import { isNullOrEmptyString } from "../functions";
import { getDefaultGeneralAbilityCategory } from "../helpers";

export const _addCategoryToGeneralAbilities = (data: any, updateData: any) => {
  if (data.type === generalAbility && isNullOrEmptyString(data.data?.category)) {
    const cat = getDefaultGeneralAbilityCategory();
    if (!updateData.data) {
      updateData.data = {};
    }
    updateData.data.category = cat;
  }
  return updateData;
};
