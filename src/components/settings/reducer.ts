import { SettingsDict } from "../../settings";

// type Action =
//   | { type: "addCategory" }
//   | { type: "deleteCategory", payload: {idx: number} }
//   | { type: "addField", payload: {categoryIdx: number} }
//   | { type: "deleteField", payload: {categoryIdx: number, fieldIdx: number} }

type AnyAction = {
  type: string,
  payload?: unknown,
}

function createAction<T = void> (type: string) {
  const f = (payload: T) => ({ type, payload });
  function match (action: AnyAction): action is { type: string, payload: T } {
    return action.type === type;
  }
  f.match = match;
  return f;
}

const addCategory = createAction("addCategory");
const deleteCategory = createAction<{idx: number}>("deleteCategory");
// const addField = createAction<{categoryIdx: number}>("addField");
// const deleteField = createAction<{categoryIdx: number, fieldIdx: number}>("deleteField");

export const reducer = (state: SettingsDict, action: AnyAction): SettingsDict => {
  const newState = { ...state };
  if (addCategory.match(action)) {
    newState.equipmentCategories = [
      ...state.equipmentCategories,
      { name: "", fields: [] },
    ];
  } else if (deleteCategory.match(action)) {
    const newCats = [...state.equipmentCategories];
    newCats.splice(action.payload.idx, 1);
    newState.equipmentCategories = newCats;
  }

  // switch (action.type) {
  //   case "addCategory": {
  //     newState.equipmentCategories = [
  //       ...state.equipmentCategories,
  //       { name: "", fields: [] },
  //     ];
  //     break;
  //   }
  //   case "deleteCategory": {
  //     const newCats = [...state.equipmentCategories];
  //     newCats.splice(action.payload.idx, 1);
  //     newState.equipmentCategories = newCats;
  //     break;
  //   }
  // }
  return newState;
};
