import {
  EquipmentFieldMetadata,
  PresetV1,
} from "@lumphammer/investigator-fvtt-types";
import { pathOfCthulhuPreset } from "../../presets";
import { SettingsDict } from "../../settings";
import produce, { Draft } from "immer";
import { State, PcOrNpc } from "./types";
import {
  getDevMode,
  moveKeyDown,
  moveKeyUp,
  renameProperty,
} from "../../functions";
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
      logger.log("Reducer apply", type, action.payload);
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

type Reducers<S> = { [key: string]: (state: Draft<S>, payload?: any) => void };

/**
 * A minimal reimagination of the `createSlice` function from
 * `@reduxjs/toolkit`.
 * This function is curried so that we can specify S (state) but allow R
 * (reducers) to be inferred.
 */
const createSlice =
  <S extends object>() =>
  <R extends Reducers<S>>(reducers: R) => {
    // turn all the reducers into cases (so they can be created and applied)
    const sliceCases = Object.entries(reducers).map(([key, reducer]) => {
      const action = createCase(key, reducer);
      return [key, action] as const;
    });
    // turn those cases back into an object o creators.
    const creators = Object.fromEntries(
      sliceCases.map(([key, action]) => [key, action.create]),
    ) as {
      // we need this mad cast because `map` can't give us accurate types.
      // we're just knitting together the `typeof createCase<...>["create"]`
      // and working out the payload type using inference.
      [key in keyof R]: ReturnType<
        typeof createCase<
          S,
          R[key] extends (state: infer S1) => void
            ? void
            : R[key] extends (state: infer S1, payload: infer P1) => void
            ? P1
            : never
        >
      >["create"];
    };
    // `useDispatch` takes the initial state as an argument, so we don't need to
    // provide a default argument for `state` here (unlike e.g. a Redux
    // reducer).
    const reducer = (state: S, action: AnyAction) => {
      try {
        const newState = produce(state, (draft) => {
          for (const [, sliceCase] of sliceCases) {
            sliceCase.apply(draft, action);
          }
        });
        if (getDevMode()) {
          const diffs = diff(state, newState);
          logger.log("Reducer diffs", diffs);
        }
        return newState;
      } catch (e) {
        // in the event of an error, we will try to keep going rather than just
        // exploding
        logger.error("Reducer error", e);
        ui.notifications?.error(`Settings error: ${e}`, { permanent: true });
        return state;
      }
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
  id: string,
  value: unknown | undefined,
): asserts field is Extract<EquipmentFieldMetadata, { type: "number" }> {
  if (field === undefined) {
    throw new Error(`No field with id ${id}`);
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
    payload: { id: string, newName: string },
  ) => {
    cats[payload.id].name = payload.newName;
  },
  changeCategoryId: (
    { settings }: State,
    payload: { oldId: string, newId: string },
  ) => {
    const newCats: typeof settings.equipmentCategories = {};
    if (settings.equipmentCategories[payload.newId]) {
      throw new Error(
        `Cannot change category id to "${payload.newId}" - already exists`,
      );
    }
    for (const [id, category] of Object.entries(settings.equipmentCategories)) {
      if (id === payload.oldId) {
        newCats[payload.newId] = category;
      } else {
        newCats[id] = category;
      }
    }
    settings.equipmentCategories = newCats;
  },
  moveCategoryUp: ({ settings }: State, { id }: { id: string }) => {
    settings.equipmentCategories = moveKeyUp(settings.equipmentCategories, id);
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
    payload: { categoryId: string, fieldId: string },
  ) => {
    delete cats[payload.categoryId].fields[payload.fieldId];
  },
  renameField: (
    { settings }: State,
    payload: { categoryId: string, fieldId: string, newName: string },
  ) => {
    settings.equipmentCategories[payload.categoryId].fields[
      payload.fieldId
    ].name = payload.newName;
  },
  changeFieldId: (
    { settings: { equipmentCategories: cats } }: State,
    payload: { categoryId: string, fieldId: string, newFieldId: string },
  ) => {
    const newFields: Record<string, EquipmentFieldMetadata> = {};
    if (cats[payload.categoryId].fields[payload.newFieldId]) {
      throw new Error(
        `Cannot change field id to "${payload.newFieldId}" - already exists`,
      );
    }
    for (const [id, field] of Object.entries(cats[payload.categoryId].fields)) {
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
      categoryId: string,
      fieldId: string,
      newType: EquipmentFieldType,
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
      categoryId: string,
      fieldId: string,
      newDefault: string | number | boolean,
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
    payload: { categoryId: string, fieldId: string, newMin: number | undefined },
  ) => {
    const field = cats[payload.categoryId].fields[payload.fieldId];
    assertNumericFieldOkayness(field, payload.fieldId, payload.newMin);
    field.min = payload.newMin;
  },
  setFieldMax: (
    { settings: { equipmentCategories: cats } }: State,
    payload: { categoryId: string, fieldId: string, newMax: number | undefined },
  ) => {
    const field = cats[payload.categoryId].fields[payload.fieldId];
    assertNumericFieldOkayness(field, payload.fieldId, payload.newMax);
    field.max = payload.newMax;
  },
  moveFieldUp: (
    { settings: { equipmentCategories: cats } }: State,
    { categoryId, fieldId }: { categoryId: string, fieldId: string },
  ) => {
    cats[categoryId].fields = moveKeyUp(cats[categoryId].fields, fieldId);
  },
  moveFieldDown: (
    { settings: { equipmentCategories: cats } }: State,
    { categoryId, fieldId }: { categoryId: string, fieldId: string },
  ) => {
    cats[categoryId].fields = moveKeyDown(cats[categoryId].fields, fieldId);
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
