import { PresetV1 } from "@lumphammer/investigator-fvtt-types";
import { pathOfCthulhuPreset } from "../../presets";
import { SettingsDict } from "../../settings";
import { PcOrNpc } from "./Stats/types";
import produce from "immer";
import { State } from "./types";
import { renameProperty } from "../../functions";

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
      return reducer ? reducer(state, action.payload) : state;
    }
    return state;
  };
  return { create, match, apply, reducer: reducer ?? ((state: S) => state) };
}

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
  "setStatMin",
  (draft: State, { which, id, value }: {which: PcOrNpc, id: string, value: number|undefined}) => {
    draft.settings[which][id].min = value;
  },
);

export const setStatDefault = createAction(
  "setStatMin",
  (draft: State, { which, id, value }: {which: PcOrNpc, id: string, value: number}) => {
    draft.settings[which][id].default = value;
  },
);

export const setStatName = createAction(
  "setStatMin",
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
    renameProperty(oldId, newId, draft.settings[which]);
  },
);

// export const changePCStat = createAction(
//   "changePCStat",
//   (state: SettingsDict, stat: Stat, id: string) => {
//     setters.pcStats({
//       ...tempSettingsRef.current.pcStats,
//       [id]: stat,
//     });
//   },
//   [setters, tempSettingsRef],
// );
// const onChangeNPCStat = useCallback(
//   (stat: Stat, id: string) => {
//     setters.npcStats({
//       ...tempSettingsRef.current.npcStats,
//       [id]: stat,
//     });
//   },
//   [setters, tempSettingsRef],
// );
// const onChangePCStatId = useCallback(
//   (oldId: string, newId: string) => {
//     const result = renameProperty(
//       oldId,
//       newId,
//       tempSettingsRef.current.pcStats,
//     );
//     setters.pcStats(result);
//   },
//   [setters, tempSettingsRef],
// );
// const onChangeNPCStatId = useCallback(
//   (oldId: string, newId: string) => {
//     const result = renameProperty(
//       oldId,
//       newId,
//       tempSettingsRef.current.npcStats,
//     );
//     setters.npcStats(result);
//   },
//   [setters, tempSettingsRef],
// );

// const onDeletePCStat = useCallback((id: string) => {
//   const result = {
//     ...tempSettingsRef.current.pcStats,
//   };
//   delete result[id];
//   setters.pcStats(result);
// }, [setters, tempSettingsRef]);

// const onDeleteNPCStat = useCallback((id: string) => {
//   const result = {
//     ...tempSettingsRef.current.npcStats,
//   };
//   delete result[id];
//   setters.npcStats(result);
// }, [setters, tempSettingsRef]);

// const onAddNPCStat = useCallback(() => {
//   setters.npcStats({
//     ...tempSettingsRef.current.npcStats,
//     [`stat${Object.keys(tempSettingsRef.current.npcStats).length}`]: {
//       name: "",
//       default: 0,
//     },
//   });
// }, [setters, tempSettingsRef]);

export const reducer = (state: State, action: AnyAction): State => {
  const newState = produce(state, (draft) => {
    setAll.apply(draft, action);
    addCategory.apply(draft, action);
    deleteCategory.apply(draft, action);
    addField.apply(draft, action);
    deleteField.apply(draft, action);
    renameCategory.apply(draft, action);
    applyPreset.apply(draft, action);
  });
  return newState;
};
