import {
  addCategoryToGeneralAbilities,
  setIconForAbilities,
  setTrackersForPreAlpha4Updates,
  upgradeNotesToRichText,
} from "./itemMigrations";
import { FlaggedMigrations } from "./types";

/**
 * Migrate a single Item entity to incorporate latest data model changes
 * @param item
 */
export const migrateItemData = function (
  item: any,
  flaggedMigrations: FlaggedMigrations,
): any {
  const updateData = {};
  addCategoryToGeneralAbilities(item, updateData);
  setTrackersForPreAlpha4Updates(item, updateData);
  setIconForAbilities(item, updateData);
  upgradeNotesToRichText(item, updateData);
  for (const itemMigration in flaggedMigrations.item) {
    flaggedMigrations.item[itemMigration](item, updateData);
  }
  return updateData;
};
