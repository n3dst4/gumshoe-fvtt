import { useCallback, useMemo, useReducer } from "react";

import { useRefStash } from "../../hooks/useRefStash";
import { getSettingsDict } from "../../settings/settings";
import { StateContext } from "./contexts";
import { createUseSelectorHook } from "./reducerTools";
import { store } from "./store";
import { Setters } from "./types";

/**
 * Top-level hook for settings state. This sets up the reducer and temporary
 * state
 */
export const useSettingsState = () => {
  const initialState = useMemo(() => ({ settings: getSettingsDict() }), []);
  const [tempState, dispatch] = useReducer(store.reducer, initialState);
  const tempStateRef = useRefStash(tempState);
  const setters = useMemo(() => {
    const setters: Partial<Setters> = {};
    for (const k of Object.keys(
      initialState.settings,
    ) as (keyof (typeof initialState)["settings"])[]) {
      setters[k] = (newVal: any) => {
        dispatch(store.creators.setSome({ newSettings: { [k]: newVal } }));
      };
    }
    return setters as Setters;
  }, [initialState]);
  const isDirty = useCallback(() => {
    return (
      JSON.stringify(tempStateRef.current) !== JSON.stringify(initialState)
    );
  }, [initialState, tempStateRef]);
  return {
    tempState,
    tempStateRef,
    setters,
    dispatch,
    isDirty,
  };
};

/**
 * A hook retrieve data from the state
 */
export const useStateSelector = createUseSelectorHook(StateContext);
