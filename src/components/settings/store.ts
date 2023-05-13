import {
  EquipmentFieldMetadata,
  PresetV1,
} from "@lumphammer/investigator-fvtt-types";
import { pathOfCthulhuPreset } from "../../presets";
import { SettingsDict } from "../../settings";
import { State, PcOrNpc } from "./types";
import {
  getDevMode,
  moveKeyDown,
  moveKeyUp,
  renameProperty,
  systemLogger,
} from "../../functions";
import { EquipmentFieldType } from "../../types";
import { nanoid } from "nanoid";
import {
  assertNumericFieldOkayness,
  createSlice,
  CreateSliceArgs,
} from "./reducerTools";

const defaultStoreArgs: CreateSliceArgs = {
  log(...args) {
    if (getDevMode()) {
      systemLogger.log(...args);
    }
  },
  onError(e) {
    systemLogger.error("Reducer error", e);
    if (ui) {
      ui.notifications?.error(`Settings error: ${e}`, { permanent: true });
    }
  },
};

export const createSystemSlice = (args: CreateSliceArgs) =>
  createSlice<State>(args)({
    setSome: (draft, payload: { newSettings: Partial<SettingsDict> }) => {
      Object.assign(draft.settings, payload.newSettings);
    },
    addCategory: (draft: State) => {
      draft.settings.equipmentCategories[nanoid()] = {
        name: "New category",
        fields: {},
      };
    },
    deleteCategory: (
      { settings: { equipmentCategories } }: State,
      { id }: { id: string },
    ) => {
      delete equipmentCategories[id];
    },
    renameCategory: (
      { settings: { equipmentCategories: cats } }: State,
      payload: { id: string; newName: string },
    ) => {
      cats[payload.id].name = payload.newName;
    },
    changeCategoryId: (
      { settings }: State,
      payload: { oldId: string; newId: string },
    ) => {
      const newCats: typeof settings.equipmentCategories = {};
      if (settings.equipmentCategories[payload.newId]) {
        throw new Error(
          `Cannot change category id to "${payload.newId}" - already exists`,
        );
      }
      for (const [id, category] of Object.entries(
        settings.equipmentCategories,
      )) {
        if (id === payload.oldId) {
          newCats[payload.newId] = category;
        } else {
          newCats[id] = category;
        }
      }
      settings.equipmentCategories = newCats;
    },
    moveCategoryUp: ({ settings }: State, { id }: { id: string }) => {
      settings.equipmentCategories = moveKeyUp(
        settings.equipmentCategories,
        id,
      );
    },
    moveCategoryDown: ({ settings }: State, { id }: { id: string }) => {
      settings.equipmentCategories = moveKeyDown(
        settings.equipmentCategories,
        id,
      );
    },
    addField: (
      { settings: { equipmentCategories: cats } }: State,
      payload: { categoryId: string },
    ) => {
      cats[payload.categoryId].fields[nanoid()] = {
        name: "New Field",
        type: "string",
        default: "",
      };
    },
    deleteField: (
      { settings: { equipmentCategories: cats } }: State,
      payload: { categoryId: string; fieldId: string },
    ) => {
      delete cats[payload.categoryId].fields[payload.fieldId];
    },
    renameField: (
      { settings }: State,
      payload: { categoryId: string; fieldId: string; newName: string },
    ) => {
      settings.equipmentCategories[payload.categoryId].fields[
        payload.fieldId
      ].name = payload.newName;
    },
    changeFieldId: (
      { settings: { equipmentCategories: cats } }: State,
      payload: { categoryId: string; fieldId: string; newFieldId: string },
    ) => {
      const newFields: Record<string, EquipmentFieldMetadata> = {};
      if (cats[payload.categoryId].fields[payload.newFieldId]) {
        throw new Error(
          `Cannot change field id to "${payload.newFieldId}" - already exists`,
        );
      }
      for (const [id, field] of Object.entries(
        cats[payload.categoryId].fields,
      )) {
        if (id === payload.fieldId) {
          newFields[payload.newFieldId] = field;
        } else {
          newFields[payload.fieldId] = field;
        }
      }
      cats[payload.categoryId].fields = newFields;
    },

    setFieldType: (
      { settings: { equipmentCategories: cats } }: State,
      payload: {
        categoryId: string;
        fieldId: string;
        newType: EquipmentFieldType;
      },
    ) => {
      const field = cats[payload.categoryId].fields[payload.fieldId];
      field.type = payload.newType;
      if (payload.newType === "number") {
        field.default = 0;
      } else if (payload.newType === "checkbox") {
        field.default = false;
      } else if (payload.newType === "string") {
        field.default = "";
      }
    },
    setFieldDefault: (
      { settings: { equipmentCategories: cats } }: State,
      payload: {
        categoryId: string;
        fieldId: string;
        newDefault: string | number | boolean;
      },
    ) => {
      const field = cats[payload.categoryId].fields[payload.fieldId];
      if (
        (field.type === "string" && typeof payload.newDefault !== "string") ||
        (field.type === "number" && typeof payload.newDefault !== "number") ||
        (field.type === "checkbox" && typeof payload.newDefault !== "boolean")
      ) {
        throw new Error(
          `Invalid default value ${payload.newDefault} for field type ${field.type}`,
        );
      }
      field.default = payload.newDefault;
    },
    setFieldMin: (
      { settings: { equipmentCategories: cats } }: State,
      payload: {
        categoryId: string;
        fieldId: string;
        newMin: number | undefined;
      },
    ) => {
      const field = cats[payload.categoryId].fields[payload.fieldId];
      assertNumericFieldOkayness(field, payload.fieldId, payload.newMin);
      field.min = payload.newMin;
    },
    setFieldMax: (
      { settings: { equipmentCategories: cats } }: State,
      payload: {
        categoryId: string;
        fieldId: string;
        newMax: number | undefined;
      },
    ) => {
      const field = cats[payload.categoryId].fields[payload.fieldId];
      assertNumericFieldOkayness(field, payload.fieldId, payload.newMax);
      field.max = payload.newMax;
    },
    moveFieldUp: (
      { settings: { equipmentCategories: cats } }: State,
      { categoryId, fieldId }: { categoryId: string; fieldId: string },
    ) => {
      cats[categoryId].fields = moveKeyUp(cats[categoryId].fields, fieldId);
    },
    moveFieldDown: (
      { settings: { equipmentCategories: cats } }: State,
      { categoryId, fieldId }: { categoryId: string; fieldId: string },
    ) => {
      cats[categoryId].fields = moveKeyDown(cats[categoryId].fields, fieldId);
    },
    applyPreset: (
      draft: State,
      payload: { preset: PresetV1; presetId: string },
    ) => {
      draft.settings = {
        // start with the current temp settings - this way we keep any values
        // not handled by the presets
        ...draft.settings,
        // now we layer in a safe default. This is typed as Required<> so it
        // will always contain one of everything that can be controlled by a
        // preset.
        ...pathOfCthulhuPreset,
        // now layer in the actual preset
        ...payload.preset,
        // and finally, set the actual preset id
        systemPreset: payload.presetId,
      };
    },
    addStat: (draft: State, { which }: { which: PcOrNpc }) => {
      // const whichKey = payload.which === "pc" ? "pcStats" : "npcStats";
      const newId = `stat${Object.keys(draft.settings[which]).length}`;
      draft.settings[which][newId] = { name: "", default: 0 };
    },
    setStatMin: (
      draft: State,
      {
        which,
        id,
        value,
      }: { which: PcOrNpc; id: string; value: number | undefined },
    ) => {
      draft.settings[which][id].min = value;
    },
    setStatMax: (
      draft: State,
      {
        which,
        id,
        value,
      }: { which: PcOrNpc; id: string; value: number | undefined },
    ) => {
      draft.settings[which][id].max = value;
    },
    setStatDefault: (
      draft: State,
      { which, id, value }: { which: PcOrNpc; id: string; value: number },
    ) => {
      draft.settings[which][id].default = value;
    },
    setStatName: (
      draft: State,
      { which, id, name }: { which: PcOrNpc; id: string; name: string },
    ) => {
      draft.settings[which][id].name = name;
    },
    deleteStat: (
      draft: State,
      { which, id }: { which: PcOrNpc; id: string },
    ) => {
      delete draft.settings[which][id];
    },
    setStatId: (
      draft: State,
      { which, oldId, newId }: { which: PcOrNpc; oldId: string; newId: string },
    ) => {
      draft.settings[which] = renameProperty(
        oldId,
        newId,
        draft.settings[which],
      );
    },
    throwError: (draft: State, { message }: { message: string }) => {
      throw new Error(message);
    },
  });

export const store = createSystemSlice(defaultStoreArgs);
