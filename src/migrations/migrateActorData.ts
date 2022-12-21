import { migrateItemData } from "./migrateItemData";
import {
  moveOldNotesToNewNoteSlots,
  moveStats,
  upgradeLongNotesToRichText,
} from "./actorMigrations";
import { FlaggedMigrations } from "./types";

/**
 * Migrate a single Actor entity to incorporate latest data model changes
 * Return an Object of updateData to be applied
 * @param {object} actor    The actor data object to update
 * @return {Object}         The updateData to apply
 */
export const migrateActorData = function (
  actorData: any,
  flaggedMigrations: FlaggedMigrations,
) {
  const updateData: any = {};

  // Actor Data Updates
  // _migrateActorMovement(actor, updateData);
  // _migrateActorSenses(actor, updateData);
  moveOldNotesToNewNoteSlots(actorData, updateData);
  upgradeLongNotesToRichText(actorData, updateData);
  moveStats(actorData, updateData);

  for (const actorMigration in flaggedMigrations.actor) {
    flaggedMigrations.actor[actorMigration](actorData, updateData);
  }

  // Migrate Owned Items
  if (!actorData.items) return updateData;
  const items = Array.from(actorData.items.entries()).flatMap(
    ([_, item]: any) => {
      const itemData =
        item instanceof CONFIG.Item.documentClass ? item.toObject() : item;

      // Migrate the Owned Item
      const itemUpdate = migrateItemData(itemData, flaggedMigrations);

      // Update the Owned Item
      if (!isObjectEmpty(itemUpdate)) {
        return [
          {
            _id: itemData._id,
            ...itemUpdate,
          },
        ];
      } else {
        return [];
      }
    },
  );
  if (items.length > 0) updateData.items = items;
  return updateData;
};
