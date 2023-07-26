import { PersonalDetail } from "@lumphammer/investigator-fvtt-types";

import * as c from "../constants";
import {
  assertGame,
  isNullOrEmptyString,
  systemLogger,
} from "../functions/utilities";
import { pathOfCthulhuPreset } from "../presets";
import { FlaggedMigrations } from "./types";

export const flaggedMigrations: FlaggedMigrations = {
  item: {
    /**
     * If you launch a world that predates the concept of equipment categories,
     * your category list will be initialised to the default value, which is a
     * single category called "general". This migration will set the category
     * field on any existing equipment.
     */
    setEquipmentCategory: (item: any, updateData: any) => {
      if (
        item.type === c.equipment &&
        isNullOrEmptyString(item.system.category)
      ) {
        systemLogger.info(`Migrating item ${item.name} to set category`);
        if (!updateData.system) {
          updateData.system = {};
        }
        updateData.system.category = Object.keys(
          pathOfCthulhuPreset.equipmentCategories,
        )[0];
      }
      return updateData;
    },
    /**
     * We've added an id to the unlocks array, which makes it easier to do
     * in/out UI transitions. This migration will add an id to any existing
     * unlocks.
     */
    addIdtoUnlocks: (item: any, updateData: any) => {
      if (item.type === c.equipment) {
        const unlocks = item.system?.unlocks ?? [];
        const updatedUnlocks = unlocks.map((unlock: any) => {
          if (unlock.id) {
            return unlock;
          }
          return {
            ...unlock,
            id: unlock.name,
          };
        });
        updateData.system = {
          ...updateData.system,
          unlocks: updatedUnlocks,
        };
      }
    },
  },
  actor: {
    /**
     * We used to use an array of strings as our "short notes". We have now
     * upgraded these to fuill items so they can given descriptions and images,
     * included in compendiums etc. This migration will turn any exsiting
     * text-based short notes into new personalDetail items.
     */
    turnShortNotesIntoPersonalDetails: (actor: any, updateData: any) => {
      if (actor.type === c.pc && actor.system.shortNotes) {
        systemLogger.info(
          `Migrating actor ${actor.name} to turn short notes into personal details`,
        );
        if (!updateData.system) {
          updateData.system = {};
        }
        const shortNoteItems = actor.system.shortNotes
          .map((shortNote: string, i: number) => ({
            type: c.personalDetail,
            img: c.personalDetailIcon,
            name: shortNote,
            system: {
              slotIndex: i,
            },
          }))
          .filter((item: any) => item.name !== null);
        const occupationItem = isNullOrEmptyString(actor.system.occupation)
          ? []
          : [
              {
                type: c.personalDetail,
                img: c.personalDetailIcon,
                name: actor.system.occupation,
                system: {
                  slotIndex: c.occupationSlotIndex,
                },
              },
            ];
        updateData.items = (updateData.items ?? [])
          .concat(shortNoteItems)
          .concat(occupationItem);
      }
      return updateData;
    },
  },
  world: {
    /**
     * Personal details are like short notes 2.0. This migration will take the
     * old short notes and turn them into personal details.
     */
    convertShortNotesToPersonalDetails: () => {
      assertGame(game);
      const shortNotes: string[] = game.settings.get(
        "investigator",
        "shortNotes",
      ) as string[];
      const personalDetails: PersonalDetail[] = shortNotes.map(
        (shortNote: string, i: number) => ({
          name: shortNote,
          type: "item",
        }),
      );
      game.settings.set("investigator", "personalDetails", personalDetails);
    },
  },
  compendium: {},
  journal: {},
  macro: {},
  scene: {},
  rollTable: {},
  playlist: {},
};
