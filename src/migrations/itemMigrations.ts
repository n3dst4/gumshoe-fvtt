import { escape } from "html-escaper";

import {
  generalAbility,
  generalAbilityIcon,
  investigativeAbility,
  investigativeAbilityIcon,
} from "../constants";
import { isNullOrEmptyString } from "../functions";
import { niceBlackAgentsPreset } from "../presets";
import { getDefaultGeneralAbilityCategory, settings } from "../settings";
import { AnyItem } from "../v10Types";

export const addCategoryToGeneralAbilities = (
  item: AnyItem,
  updateData: any,
) => {
  if (
    item.type === generalAbility &&
    isNullOrEmptyString(item.system.category)
  ) {
    const cat = getDefaultGeneralAbilityCategory();
    if (!updateData.system) {
      updateData.system = {};
    }
    updateData.system.category = cat;
  }
  return updateData;
};

export const setTrackersForPreAlpha4Updates = (
  item: AnyItem,
  updateData: any,
) => {
  const currentlyMigratedVersion = settings.systemMigrationVersion.get();
  const needsMigrationVersion = "1.0.0-alpha.5";
  const needsMigration = isNewerVersion(
    needsMigrationVersion,
    currentlyMigratedVersion,
  );
  const isRelevant = ["Health", "Sanity", "Stability", "Magic"].includes(
    item.name ?? "",
  );

  if (item.type === generalAbility && needsMigration && isRelevant) {
    updateData.system.showTracker = true;
  }
  return updateData;
};

export const setIconForAbilities = (item: AnyItem, updateData: any) => {
  if (
    (item.type === generalAbility || item.type === investigativeAbility) &&
    (isNullOrEmptyString(item.img) || item.img === "icons/svg/mystery-man.svg")
  ) {
    updateData.img =
      item.type === generalAbility
        ? generalAbilityIcon
        : investigativeAbilityIcon;
  }
  return updateData;
};

export const upgradeNotesToRichText = (item: AnyItem, updateData: any) => {
  if (typeof item.system.notes === "string") {
    if (!updateData.system) {
      updateData.system = {};
    }
    updateData.system.notes = {
      format: "plain",
      source: item.system.notes,
      html: escape(item.system.notes),
    };
  }
  return updateData;
};

export const setEquipmentCategory = (item: AnyItem, updateData: any) => {
  const categories = settings.equipmentCategories.get();
  // we are only proceeding if we have default categories, so it's either a brave new world, or we're migrating
  if (
    JSON.stringify(categories) ===
    JSON.stringify(niceBlackAgentsPreset.equipmentCategories)
  ) {
    /// XXX WIP
  }

  if (item.type === "equipment" && isNullOrEmptyString(item.system.category)) {
    if (!updateData.system) {
      updateData.system = {};
    }
    updateData.system.category = "Other";
  }
  return updateData;
};
