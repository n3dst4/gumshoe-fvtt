import {
  addCategoryToGeneralAbilities,
  setIconForAbilities,
  setTrackersForPreAlpha4Updates,
  upgradeNotesToRichText,
} from "./itemMigrations";

/**
 * Migrate a single Item entity to incorporate latest data model changes
 * @param item
 */
export const migrateItemData = function (item: any): any {
  const updateData = {};
  addCategoryToGeneralAbilities(item, updateData);
  setTrackersForPreAlpha4Updates(item, updateData);
  setIconForAbilities(item, updateData);
  upgradeNotesToRichText(item, updateData);
  return updateData;
};
