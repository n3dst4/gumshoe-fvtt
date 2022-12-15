import { generalAbility } from "../constants";
import { isNullOrEmptyString } from "../functions";
import { getDefaultGeneralAbilityCategory } from "../settings";
import { FlaggedMigrations } from "./types";

export const flaggedMigrations: FlaggedMigrations = {
  item: {
    setCategory: (data: any, updateData: any) => {
      if (data.type === generalAbility && isNullOrEmptyString(data.data?.category)) {
        const cat = getDefaultGeneralAbilityCategory();
        if (!updateData.data) {
          updateData.data = {};
        }
        updateData.data.category = cat;
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
