import { PresetV1 } from "@lumphammer/investigator-fvtt-types";
import { pathOfCthulhuPreset } from "../../presets";
import { getSettingsDict, SettingsDict } from "../../settings";
import produce, { Draft } from "immer";
import { State, PcOrNpc } from "./types";
import { renameProperty } from "../../functions";
import { diff } from "just-diff";

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
 *  * a `create` method that returns an action object, and an `apply`
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
 * A minimal reimplementation of the `createSlice` function from
 * `@reduxjs/toolkit`.
 */
function createSlice<
  S extends object,
  C extends { [key: string]: (state: Draft<S>, payload?: any) => void }
>(initialState: S, reducers: C) {
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
  const reducer = (state: S = initialState, action: AnyAction) => {
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
}

export const slice = createSlice(
  { settings: getSettingsDict() },
  {
    setAll: (draft, payload: { newSettings: SettingsDict }) => {
      draft.settings = payload.newSettings;
    },
    setSome: (draft, payload: { newSettings: Partial<SettingsDict> }) => {
      Object.assign(draft.settings, payload.newSettings);
    },
    addCategory: (draft: State) => {
      draft.settings.equipmentCategories.push({ name: "", fields: [] });
    },

    deleteCategory: (draft: State, payload: { idx: number }) => {
      draft.settings.equipmentCategories.splice(payload.idx, 1);
    },
    addField: (
      { settings: { equipmentCategories: cats } }: State,
      payload: { categoryIdx: number },
    ) => {
      cats[payload.categoryIdx].fields ||= [];
      const fields = cats[payload.categoryIdx].fields || [];
      fields.push({
        name: "",
        type: "string",
        default: "",
      });
      cats[payload.categoryIdx].fields = fields;
    },
    deleteField: (
      { settings: { equipmentCategories: cats } }: State,
      payload: { categoryIdx: number, fieldIdx: number },
    ) => {
      cats[payload.categoryIdx].fields?.splice(payload.fieldIdx, 1);
    },
    renameCategory: (
      { settings: { equipmentCategories: cats } }: State,
      payload: { idx: number, newName: string },
    ) => {
      cats[payload.idx].name = payload.newName;
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
    deleteStat: (
      draft: State,
      { which, id }: { which: PcOrNpc, id: string },
    ) => {
      delete draft.settings[which][id];
    },
    setStatId: (
      draft: State,
      { which, oldId, newId }: { which: PcOrNpc, oldId: string, newId: string },
    ) => {
      draft.settings[which] = renameProperty(
        oldId,
        newId,
        draft.settings[which],
      );
    },
  },
);

// export const setAll = createCase(
//   "setAll",
//   (draft: State, payload: {newSettings: SettingsDict}) => {
//     draft.settings = payload.newSettings;
//   },
// );

// export const addCategory = createCase(
//   "addCategory",
//   (draft: State) => {
//     draft.settings.equipmentCategories.push({ name: "", fields: [] });
//   },
// );

// export const deleteCategory = createCase(
//   "deleteCategory",
//   (draft: State, payload: {idx: number}) => {
//     draft.settings.equipmentCategories.splice(payload.idx, 1);
//   },
// );

// export const addField = createCase(
//   "addField",
//   ({ settings: { equipmentCategories: cats } }: State, payload: {categoryIdx: number}) => {
//     cats[payload.categoryIdx].fields ||= [];
//     const fields = cats[payload.categoryIdx].fields || [];
//     fields.push({
//       name: "", type: "string", default: "",
//     });
//     cats[payload.categoryIdx].fields = fields;
//   },
// );

// export const deleteField = createCase(
//   "deleteField",
//   ({ settings: { equipmentCategories: cats } }: State, payload: {categoryIdx: number, fieldIdx: number}) => {
//     cats[payload.categoryIdx].fields?.splice(payload.fieldIdx, 1);
//   },
// );

// export const renameCategory = createCase(
//   "renameCategory",
//   ({ settings: { equipmentCategories: cats } }: State, payload: {idx: number, newName: string}) => {
//     cats[payload.idx].name = payload.newName;
//   },
// );

// export const applyPreset = createCase(
//   "applyPreset",
//   (draft: State, payload: {preset: PresetV1, presetId: string}) => {
//     draft.settings = {
//       // start with the current temp settings - this way we keep any values
//       // not handled by the presets
//       ...draft.settings,
//       // now we layer in a safe default. This is typed as Required<> so it
//       // will always contain one of everything that can be controlled by a
//       // preset.
//       ...pathOfCthulhuPreset,
//       // now layer in the actual preset
//       ...payload.preset,
//       // and finally, set the actual preset id
//       systemPreset: payload.presetId,
//     };
//   },
// );

// export const addStat = createCase(
//   "addStat",
//   (draft: State, { which }: {which: PcOrNpc}) => {
//     // const whichKey = payload.which === "pc" ? "pcStats" : "npcStats";
//     const newId = `stat${Object.keys(draft.settings[which]).length}`;
//     draft.settings[which][newId] = { name: "", default: 0 };
//   },
// );

// export const setStatMin = createCase(
//   "setStatMin",
//   (draft: State, { which, id, value }: {which: PcOrNpc, id: string, value: number|undefined}) => {
//     draft.settings[which][id].min = value;
//   },
// );

// export const setStatMax = createCase(
//   "setStatMax",
//   (draft: State, { which, id, value }: {which: PcOrNpc, id: string, value: number|undefined}) => {
//     draft.settings[which][id].max = value;
//   },
// );

// export const setStatDefault = createCase(
//   "setStatDefault",
//   (draft: State, { which, id, value }: {which: PcOrNpc, id: string, value: number}) => {
//     draft.settings[which][id].default = value;
//   },
// );

// export const setStatName = createCase(
//   "setStatName",
//   (draft: State, { which, id, name }: {which: PcOrNpc, id: string, name: string}) => {
//     draft.settings[which][id].name = name;
//   },
// );

// export const deleteStat = createCase(
//   "deleteStat",
//   (draft: State, { which, id }: {which: PcOrNpc, id: string}) => {
//     delete draft.settings[which][id];
//   },
// );

// export const setStatId = createCase(
//   "setStatId",
//   (draft: State, { which, oldId, newId }: {which: PcOrNpc, oldId: string, newId: string}) => {
//     draft.settings[which] = renameProperty(oldId, newId, draft.settings[which]);
//   },
// );

// export const reducer = (state: State, action: AnyAction): State => {
//   const newState = produce(state, (draft) => {
//     setAll.apply(draft, action);
//     addCategory.apply(draft, action);
//     deleteCategory.apply(draft, action);
//     addField.apply(draft, action);
//     deleteField.apply(draft, action);
//     renameCategory.apply(draft, action);
//     applyPreset.apply(draft, action);
//     addStat.apply(draft, action);
//     setStatMin.apply(draft, action);
//     setStatMax.apply(draft, action);
//     setStatDefault.apply(draft, action);
//     setStatName.apply(draft, action);
//     deleteStat.apply(draft, action);
//     setStatId.apply(draft, action);
//   });
//   const diffs = diff(state, newState);
//   console.log(diffs);
//   return newState;
// };
