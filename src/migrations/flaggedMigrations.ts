import * as c from "../constants";
import { isNullOrEmptyString } from "../functions";
import { pathOfCthulhuPreset } from "../presets";
import { FlaggedMigrations } from "./types";

export const flaggedMigrations: FlaggedMigrations = {
  item: {
    /**
     * If you launch a world the predates the concept of equipment categories,
     * your category list will be initialised to the default value, which is a
     * single category called "general". This migration will set the category
     * field on any existing equipment.
     */
    setEquipmentCategory: (data: any, updateData: any) => {
      if (
        data.type === c.equipment &&
        isNullOrEmptyString(data.data?.category)
      ) {
        logger.info(`Migrating item ${data.name} to set category`);
        if (!updateData.data) {
          updateData.data = {};
        }
        updateData.data.category = Object.keys(
          pathOfCthulhuPreset.equipmentCategories,
        )[0];
      }
      return updateData;
    },
  },
  actor: {},
  world: {},
  compendium: {},
  journal: {},
  macro: {},
  scene: {},
  rollTable: {},
  playlist: {},
};
