import { generalAbility, generalAbilityIcon, investigativeAbilityIcon, systemMigrationVersion } from "../constants";
import { isAbility, isGeneralAbility, isNullOrEmptyString } from "../functions";
import { getDefaultGeneralAbilityCategory } from "../helpers";
import system from "../system.json";

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

export const _setTrackersForPreAlpha4Updates = (data: any, updateData: any) => {
  const currentVersion = game.settings.get(system.name, systemMigrationVersion);
  const needsMigration = isNewerVersion("1.0.0-alpha.4", currentVersion);
  const isRelevant = ["Health", "Sanity", "Stability", "Magic"].includes(data.name);

  if (data.type === generalAbility && needsMigration && isRelevant) {
    if (!updateData.data) {
      updateData.data = {};
    }
    updateData.data.showTracker = true;
  }
  return updateData;
};

export const _setIconForAbilities = (data: any, updateData: any) => {
  if (isAbility(data.type) && (isNullOrEmptyString(data.img) || data.img === "icons/svg/mystery-man.svg")) {
    if (!updateData.data) {
      updateData.data = {};
    }
    updateData.img = isGeneralAbility(data.type ?? "") ? generalAbilityIcon : investigativeAbilityIcon;
  }
  return updateData;
};
