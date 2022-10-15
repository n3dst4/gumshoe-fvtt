import {
  EquipmentFieldMetadata,
  PresetV1,
} from "@lumphammer/investigator-fvtt-types";
import { pathOfCthulhuPreset } from "../../presets";
import { CookedEquipmentCategory, CookedFieldMetadata, cookPresetEquipmentCategories, SettingsDict } from "../../settings";
import produce, { Draft } from "immer";
import { State, PcOrNpc } from "./types";
import { renameProperty } from "../../functions";
import { diff } from "just-diff";
import { EquipmentFieldType } from "../../types";
import { nanoid } from "nanoid";

/**
 * A minimal case for all actions - there will always be a `type` and a
 * `payload` property, but the payload may be `undefined`.
 */
type AnyAction = {
  type: string,
  payload?: unknown,
};

/**
 * A minimal reimplementation of the `createAction` function from
 * `@reduxjs/toolkit`.
 *
 * Given a unique string (danger will robinson!) and a reducer function, returns
 * an object with
 *
 *  * a `create` method that returns an action object
 *  * an `apply` function, which take a state and an action and applies the
 *    relevant reducer if the action matches the case
 */
function createCase<S, P = void> (
  type: string,
  reducer: (draft: S, payload: P) => void,
) {
  const create = (payload: P) => ({ type, payload });
  const match = (action: AnyAction): action is { type: string, payload: P } =>
    action.type === type;
  const apply = (state: S, action: AnyAction) => {
    if (match(action)) {
      logger.log("Reducer", type, action.payload);
      return reducer ? reducer(state, action.payload) : state;
    }
    return state;
  };
  return {
    /** Create an action (to be dispatched with `dispatch` from `useReducer` */
    create,
    /**
     * given a mutable draft object of S, and action, mutate the draft if the
     * action is from this slice.
     */
    apply,
  };
}

/**
 * A minimal reimagination of the `createSlice` function from
 * `@reduxjs/toolkit`.
 */
const createSlice =
  <
    // curried so that we can specify S but allow C to be inferred
    S extends object
  >() =>
  <C extends { [key: string]: (state: Draft<S>, payload?: any) => void }>(
      reducers: C,
    ) => {
    const sliceCases = Object.entries(reducers).map(([key, reducer]) => {
      const action = createCase(key, reducer);
      return [key, action] as const;
    });
    const creators = Object.fromEntries(
      sliceCases.map(([key, action]) => [key, action.create]),
    ) as {
      [key in keyof C]: ReturnType<
        typeof createCase<
          S,
          C[key] extends (state: infer S1) => void
            ? void
            : C[key] extends (state: infer S1, payload: infer P1) => void
            ? P1
            : never
        >
      >["create"];
    };
    // `useDispatch` takes the initial state as an argument, so we don't need to
    // provide a default argument for `state` here.
    const reducer = (state: S, action: AnyAction) => {
      const newState = produce(state, (draft) => {
        for (const [, sliceCase] of sliceCases) {
          sliceCase.apply(draft, action);
        }
      });
      const diffs = diff(state, newState);
      console.log(diffs);
      return newState;
    };

    return {
      /**
       * A dictionary of action creators, keyed by the name of the case.
       */
      creators,
      /**
       * The reducer function for this slice.
       */
      reducer,
    };
  };

function assertNumericFieldOkayness (
  field: EquipmentFieldMetadata | undefined,
  index: number,
  value: unknown|undefined,
): asserts field is Extract<EquipmentFieldMetadata, { type: "number" }> {
  if (field === undefined) {
    throw new Error(`No field at index ${index}`);
  }
  if (field.type !== "number") {
    throw new Error(`Cannot set min/max on field type ${field.type}`);
  }
  if (typeof value !== "number" && value !== undefined) {
    throw new Error(
      `Invalid value ${value} for field ${field.name} (must be a number)`,
    );
  }
}

export const slice = createSlice<State>()({
  setAll: (draft, payload: { newSettings: SettingsDict }) => {
    draft.settings = payload.newSettings;
  },
  setSome: (draft, payload: { newSettings: Partial<SettingsDict> }) => {
    Object.assign(draft.settings, payload.newSettings);
  },
  addCategory: (draft: State) => {
    draft.settings.equipmentCategories[nanoid()] = {
      name: "",
      displayOrder: (Object.keys(draft.settings.equipmentCategories).length + 1) * 10,
      fields: {},
    };
  },
  deleteCategory: (draft: State, payload: { idx: number }) => {
    draft.settings.equipmentCategories.splice(payload.idx, 1);
  },
  renameCategory: (
    { settings: { equipmentCategories: cats } }: State,
    payload: { idx: number, newName: string },
  ) => {
    cats[payload.idx].name = payload.newName;
  },
  moveCategoryUp: (
    { settings: { equipmentCategories: cats } }: State,
    { id }: { id: string },
  ) => {
    
    if (idx === 0) {
      throw new Error(`Cannot move category up from index ${idx}`);
    }
    if (idx >= cats.length || idx < 0) {
      throw new Error(`No category at index ${idx}`);
    }
    const cat = cats[idx];
    cats.splice(idx, 1);
    cats.splice(idx - 1, 0, cat);
  },
  moveCategoryDown: (
    { settings: { equipmentCategories: cats } }: State,
    { idx }: { idx: number },
  ) => {
    if (idx === cats.length - 1) {
      throw new Error("Cannot move category down from last index");
    }
    if (idx >= cats.length || idx < 0) {
      throw new Error(`No category at index ${idx}`);
    }
    const cat = cats[idx];
    cats.splice(idx, 1);
    cats.splice(idx + 1, 0, cat);
  },
  addField: (
    { settings: { equipmentCategories: cats } }: State,
    payload: { categoryIdx: number },
  ) => {
    // cats[payload.categoryIdx].fields ||= {};
    const fields = cats[payload.categoryIdx].fields;
    fields.push({
      id: nanoid(),
      name: "New Field",
      type: "string",
      default: "",
    });
    cats[payload.categoryIdx].fields = fields;
  },
  deleteField: (
    { settings: { equipmentCategories: cats } }: State,
    payload: { categoryId: string, fieldId: string },
  ) => {
    const cat = cats.find((c) => c.id === payload.categoryId);
    const fieldIdx = cat?.fields.findIndex(
      (f) => f.id === payload.fieldId,
    );
    if (fieldIdx !== undefined && fieldIdx > -1) {
      cat?.fields.splice(fieldIdx, 1);
    }
  },
  renameField: (
    state: State,
    payload: { categoryId: string, fieldId: string, newName: string },
  ) => {
    selectField(cats, payload.categoryId, payload.fieldId).name =
    const fields = cats[payload.categoryIdx].fields;
    if (fields?.[payload.fieldIdx]) {
      fields[payload.fieldIdx].name = payload.newName;
    }
  },
  setFieldType: (
    { settings: { equipmentCategories: cats } }: State,
    payload: { categoryIdx: number, fieldIdx: number, newType: EquipmentFieldType },
  ) => {
    const field = cats[payload.categoryIdx].fields?.[payload.fieldIdx];
    if (field === undefined) {
      throw new Error(`No field at index ${payload.fieldIdx}`);
    }
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
    payload: { categoryIdx: number, fieldIdx: number, newDefault: string|number|boolean },
  ) => {
    const field = cats[payload.categoryIdx].fields?.[payload.fieldIdx];
    if (field === undefined) {
      throw new Error(`No field at index ${payload.fieldIdx}`);
    }
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
    payload: { categoryIdx: number, fieldIdx: number, newMin: number|undefined },
  ) => {
    const field = cats[payload.categoryIdx].fields?.[payload.fieldIdx];
    assertNumericFieldOkayness(field, payload.fieldIdx, payload.newMin);
    field.min = payload.newMin;
  },
  setFieldMax: (
    { settings: { equipmentCategories: cats } }: State,
    payload: { categoryIdx: number, fieldIdx: number, newMax: number|undefined },
  ) => {
    const field = cats[payload.categoryIdx].fields?.[payload.fieldIdx];
    assertNumericFieldOkayness(field, payload.fieldIdx, payload.newMax);
    field.max = payload.newMax;
  },
  moveFieldUp: (
    { settings: { equipmentCategories: cats } }: State,
    { categoryId, fieldId }: { categoryId: string, fieldId: string },
  ) => {
    const categoryIdx = cats.findIndex((c) => c.id === categoryId);
    const fields = cats[categoryIdx].fields;
    const fieldIdx = fields.findIndex((f) => f.id === fieldId);
    if (fields === undefined) {
      throw new Error(`No fields in category ${categoryIdx}`);
    }
    if (fieldIdx === 0) {
      throw new Error("Cannot move field up from index 0");
    }
    if (fieldIdx >= fields.length || fieldIdx < 0) {
      throw new Error(`No field at index ${fieldIdx}`);
    }
    const field = fields[fieldIdx];
    fields.splice(fieldIdx, 1);
    fields.splice(fieldIdx - 1, 0, field);
  },
  moveFieldDown: (
    { settings: { equipmentCategories: cats } }: State,
    { categoryIdx, fieldIdx }: { categoryIdx: number, fieldIdx: number },
  ) => {
    const fields = cats[categoryIdx].fields;
    if (fields === undefined) {
      throw new Error(`No fields in category ${categoryIdx}`);
    }
    if (fieldIdx === fields.length - 1) {
      throw new Error("Cannot move field down from last index");
    }
    if (fieldIdx >= fields.length || fieldIdx < 0) {
      throw new Error(`No field at index ${fieldIdx}`);
    }
    const field = fields[fieldIdx];
    fields.splice(fieldIdx, 1);
    fields.splice(fieldIdx + 1, 0, field);
  },
  applyPreset: (
    draft: State,
    payload: { preset: PresetV1, presetId: string },
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
      // we treat equipment categories special
      equipmentCategories: cookPresetEquipmentCategories(payload.preset.equipmentCategories),
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
    }: { which: PcOrNpc, id: string, value: number | undefined },
  ) => {
    draft.settings[which][id].min = value;
  },
  setStatMax: (
    draft: State,
    {
      which,
      id,
      value,
    }: { which: PcOrNpc, id: string, value: number | undefined },
  ) => {
    draft.settings[which][id].max = value;
  },
  setStatDefault: (
    draft: State,
    { which, id, value }: { which: PcOrNpc, id: string, value: number },
  ) => {
    draft.settings[which][id].default = value;
  },
  setStatName: (
    draft: State,
    { which, id, name }: { which: PcOrNpc, id: string, name: string },
  ) => {
    draft.settings[which][id].name = name;
  },
  deleteStat: (draft: State, { which, id }: { which: PcOrNpc, id: string }) => {
    delete draft.settings[which][id];
  },
  setStatId: (
    draft: State,
    { which, oldId, newId }: { which: PcOrNpc, oldId: string, newId: string },
  ) => {
    draft.settings[which] = renameProperty(oldId, newId, draft.settings[which]);
  },
});

