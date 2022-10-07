import { PresetV1 } from "@lumphammer/investigator-fvtt-types";
import { pathOfCthulhuPreset } from "../../presets";
import { getSettingsDict, SettingsDict } from "../../settings";
import produce from "immer";
import { State, PcOrNpc } from "./types";
import { renameProperty } from "../../functions";
import { diff } from "just-diff";

type AnyAction = {
  type: string,
  payload?: unknown,
}

function createAction<S, P = void> (type: string, reducer?: (state: S, payload: P) => void) {
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
  return { create, match, apply, reducer: reducer ?? ((state: S) => state) };
}

// type SliceActionOf<S, T> = T extends

function createSlice<S, C extends { [key: string]: (state: S, payload: any) => void }> (initialState: S, reducers: C) {
  // type R = {[key in keyof C]: ReturnType<typeof createAction<S, C[key] extends ((state: infer S1, payload: infer P1) => void) ? P1 : never>>}
  const actions: {[key in keyof C]: ReturnType<typeof createAction<S, C[key] extends ((state: infer S1, payload: infer P1) => void) ? P1 : never>>} = Object.fromEntries(Object.entries(reducers).map(([key, reducer]) => {
    const action = createAction(key, reducer);
    return [key, action];
  })) as {[key in keyof C]: ReturnType<typeof createAction<S, C[key] extends ((state: infer S1, payload: infer P1) => void) ? P1 : never>>};
  return actions;
}

const slice = createSlice(
  { settings: getSettingsDict() },
  {
    setAll: (draft: State, payload: {newSettings: SettingsDict}) => {
      draft.settings = payload.newSettings;
    },
  },
);

export const setAll = createAction(
  "setAll",
  (draft: State, payload: {newSettings: SettingsDict}) => {
    draft.settings = payload.newSettings;
  },
);

export const addCategory = createAction(
  "addCategory",
  (draft: State) => {
    draft.settings.equipmentCategories.push({ name: "", fields: [] });
  },
);

export const deleteCategory = createAction(
  "deleteCategory",
  (draft: State, payload: {idx: number}) => {
    draft.settings.equipmentCategories.splice(payload.idx, 1);
  },
);

export const addField = createAction(
  "addField",
  ({ settings: { equipmentCategories: cats } }: State, payload: {categoryIdx: number}) => {
    cats[payload.categoryIdx].fields ||= [];
    const fields = cats[payload.categoryIdx].fields || [];
    fields.push({
      name: "", type: "string", default: "",
    });
    cats[payload.categoryIdx].fields = fields;
  },
);

export const deleteField = createAction(
  "deleteField",
  ({ settings: { equipmentCategories: cats } }: State, payload: {categoryIdx: number, fieldIdx: number}) => {
    cats[payload.categoryIdx].fields?.splice(payload.fieldIdx, 1);
  },
);

export const renameCategory = createAction(
  "renameCategory",
  ({ settings: { equipmentCategories: cats } }: State, payload: {idx: number, newName: string}) => {
    cats[payload.idx].name = payload.newName;
  },
);

export const applyPreset = createAction(
  "applyPreset",
  (draft: State, payload: {preset: PresetV1, presetId: string}) => {
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
);

export const addStat = createAction(
  "addStat",
  (draft: State, { which }: {which: PcOrNpc}) => {
    // const whichKey = payload.which === "pc" ? "pcStats" : "npcStats";
    const newId = `stat${Object.keys(draft.settings[which]).length}`;
    draft.settings[which][newId] = { name: "", default: 0 };
  },
);

export const setStatMin = createAction(
  "setStatMin",
  (draft: State, { which, id, value }: {which: PcOrNpc, id: string, value: number|undefined}) => {
    draft.settings[which][id].min = value;
  },
);

export const setStatMax = createAction(
  "setStatMax",
  (draft: State, { which, id, value }: {which: PcOrNpc, id: string, value: number|undefined}) => {
    draft.settings[which][id].max = value;
  },
);

export const setStatDefault = createAction(
  "setStatDefault",
  (draft: State, { which, id, value }: {which: PcOrNpc, id: string, value: number}) => {
    draft.settings[which][id].default = value;
  },
);

export const setStatName = createAction(
  "setStatName",
  (draft: State, { which, id, name }: {which: PcOrNpc, id: string, name: string}) => {
    draft.settings[which][id].name = name;
  },
);

export const deleteStat = createAction(
  "deleteStat",
  (draft: State, { which, id }: {which: PcOrNpc, id: string}) => {
    delete draft.settings[which][id];
  },
);

export const setStatId = createAction(
  "setStatId",
  (draft: State, { which, oldId, newId }: {which: PcOrNpc, oldId: string, newId: string}) => {
    draft.settings[which] = renameProperty(oldId, newId, draft.settings[which]);
  },
);

export const reducer = (state: State, action: AnyAction): State => {
  const newState = produce(state, (draft) => {
    setAll.apply(draft, action);
    addCategory.apply(draft, action);
    deleteCategory.apply(draft, action);
    addField.apply(draft, action);
    deleteField.apply(draft, action);
    renameCategory.apply(draft, action);
    applyPreset.apply(draft, action);
    addStat.apply(draft, action);
    setStatMin.apply(draft, action);
    setStatMax.apply(draft, action);
    setStatDefault.apply(draft, action);
    setStatName.apply(draft, action);
    deleteStat.apply(draft, action);
    setStatId.apply(draft, action);
  });
  const diffs = diff(state, newState);
  console.log(diffs);
  return newState;
};
