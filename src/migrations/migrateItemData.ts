import { _addCategoryToGeneralAbilities } from "./_addCategoryToGeneralAbilities";

/**
 * Migrate a single Item entity to incorporate latest data model changes
 * @param item
 */
export const migrateItemData = function (item: any): any {
  const updateData = {};
  _addCategoryToGeneralAbilities(item, updateData);
  return updateData;
};
