import { PresetV1 } from "@lumphammer/investigator-fvtt-types";
import { pathOfCthulhuPreset } from "../../presets";
import { SettingsDict } from "../../settings";

type AnyAction = {
  type: string,
  payload?: unknown,
}

function createAction<S, P = void> (type: string, reducer?: (state: S, payload: P) => S) {
  const create = (payload: P) => ({ type, payload });
  const match = (action: AnyAction): action is { type: string, payload: P } =>
    action.type === type;
  const apply = (state: S, action: AnyAction) => {
    if (match(action)) {
      return reducer ? reducer(state, action.payload) : state;
    }
    return state;
  };
  return { create, match, apply, reducer: reducer ?? ((state: S) => state) };
}

export const setAll = createAction<SettingsDict, {newSettings: SettingsDict}>(
  "setAll",
  (state, payload) => {
    return payload.newSettings;
  },
);

export const addCategory = createAction(
  "addCategory",
  (state: SettingsDict, payload: { category: string }) => {
    const newState = {
      ...state,
      equipmentCategories: [
        ...state.equipmentCategories,
        { name: "", fields: [] },
      ],
    };
    return newState;
  },
);

export const deleteCategory = createAction(
  "deleteCategory",
  (state: SettingsDict, payload: {idx: number}) => {
    const newState = { ...state };
    const newCats = [...state.equipmentCategories];
    newCats.splice(payload.idx, 1);
    newState.equipmentCategories = newCats;
    return newState;
  },
);

export const addField = createAction<SettingsDict, {categoryIdx: number}>(
  "addField",
  (state, payload) => {
    const newState = { ...state };
    const newCats = [...state.equipmentCategories];
    newCats[payload.categoryIdx].fields =
      newCats[payload.categoryIdx].fields === undefined
        ? []
        : newCats[payload.categoryIdx].fields;
    newCats[payload.categoryIdx].fields?.push({ name: "", type: "string", default: "" });
    newState.equipmentCategories = newCats;
    return newState;
  },
);

export const deleteField = createAction<SettingsDict, {categoryIdx: number, fieldIdx: number}>(
  "deleteField",
  (state, payload) => {
    const newState = { ...state };
    const newCats = [...state.equipmentCategories];
    newCats[payload.categoryIdx].fields?.splice(payload.fieldIdx, 1);
    newState.equipmentCategories = newCats;
    return newState;
  },
);

export const renameCategory = createAction<SettingsDict, {idx: number, newName: string}>(
  "renameCategory",
  (state, payload) => {
    const newState = { ...state };
    const newCats = [...state.equipmentCategories];
    newCats[payload.idx].name = payload.newName;
    newState.equipmentCategories = newCats;
    return newState;
  },
);

export const applyPreset = createAction<SettingsDict, {preset: PresetV1, presetId: string}>(
  "applyPreset",
  (state, payload) => {
    return {
      // start with the current temp settings - this way we keep any values
      // not handled by the presets
      ...state,
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
);

export const reducer = (state: SettingsDict, action: AnyAction): SettingsDict => {
  let newState = state;
  newState = setAll.apply(newState, action);
  newState = addCategory.apply(newState, action);
  newState = deleteCategory.apply(newState, action);
  newState = addField.apply(newState, action);
  newState = deleteField.apply(newState, action);
  newState = renameCategory.apply(newState, action);
  newState = applyPreset.apply(newState, action);
  return newState;
};
