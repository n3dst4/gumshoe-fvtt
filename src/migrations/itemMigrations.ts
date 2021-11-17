import { generalAbility, generalAbilityIcon, investigativeAbilityIcon } from "../constants";
import { isAbility, isGeneralAbility, isNullOrEmptyString } from "../functions";
import { getSystemMigrationVersion, getDefaultGeneralAbilityCategory } from "../settingsHelpers";
import { escape } from "html-escaper";

export const addCategoryToGeneralAbilities = (data: any, updateData: any) => {
  if (data.type === generalAbility && isNullOrEmptyString(data.data?.category)) {
    const cat = getDefaultGeneralAbilityCategory();
    if (!updateData.data) {
      updateData.data = {};
    }
    updateData.data.category = cat;
  }
  return updateData;
};

export const setTrackersForPreAlpha4Updates = (data: any, updateData: any) => {
  const currentlyMigratedVersion = getSystemMigrationVersion();
  const needsMigrationVersion = "1.0.0-alpha.5";
  const needsMigration = isNewerVersion(needsMigrationVersion, currentlyMigratedVersion);
  const isRelevant = ["Health", "Sanity", "Stability", "Magic"].includes(data.name);

  if (data.type === generalAbility && needsMigration && isRelevant) {
    if (!updateData.data) {
      updateData.data = {};
    }
    updateData.data.showTracker = true;
  }
  return updateData;
};

export const setIconForAbilities = (data: any, updateData: any) => {
  if (isAbility(data.type) && (isNullOrEmptyString(data.img) || data.img === "icons/svg/mystery-man.svg")) {
    if (!updateData.data) {
      updateData.data = {};
    }
    updateData.img = isGeneralAbility(data.type ?? "")
      ? generalAbilityIcon
      : investigativeAbilityIcon;
  }
  return updateData;
};

export const upgradeNotesToRichText = (data: any, updateData: any) => {
  if (typeof data.data.notes === "string") {
    updateData.data.data.notes = {
      format: "plain",
      source: data.data.notes,
      html: escape(data.data.notes),
    };
  }
  return updateData;
};
