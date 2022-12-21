import { useCallback, useContext, useMemo, useReducer } from "react";
import { useRefStash } from "../../hooks/useRefStash";
import { getSettingsDict } from "../../settings";
import { StateContext } from "./contexts";
import { slice } from "./reducer";
import { Setters, State } from "./types";

export const useSettingsState = () => {
  const initialState = useMemo(() => ({ settings: getSettingsDict() }), []);
  const [tempState, dispatch] = useReducer(slice.reducer, initialState);
  const tempStateRef = useRefStash(tempState);
  const setters = useMemo(() => {
    const setters: Partial<Setters> = {};
    for (const k of Object.keys(initialState.settings) as (keyof typeof initialState["settings"])[]) {
      setters[k] = (newVal: any) => {
        dispatch(slice.creators.setSome({ newSettings: { [k]: newVal } }));
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

export const useSettingsStateSelector = <T>(
  selector: (state: State) => T,
) => {
  const state = useContext(StateContext);
  const t = selector(state);
  return t;
};
