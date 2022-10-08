import { useCallback, useMemo, useReducer } from "react";
import { customSystem } from "../../constants";
import { useRefStash } from "../../hooks/useRefStash";
import { getSettingsDict } from "../../settings";
import { slice } from "./reducer";
import { Setters } from "./types";

export const useTempSettings = () => {
  const initialState = useMemo(() => ({ settings: getSettingsDict() }), []);
  const [tempSettings, dispatch] = useReducer(
    slice.reducer,
    initialState,
  );
  const tempStateRef = useRefStash(tempSettings);
  const setters = useMemo(() => {
    const setters: Record<string, any> = {};
    for (const k of Object.keys(initialState)) {
      setters[k] = (newVal: any) => {
        dispatch(
          slice.creators.setAll({
            newSettings: {
              ...tempStateRef.current.settings,
              [k]: newVal,
              systemPreset: customSystem,
            },
          }),
        );
      };
    }
    return setters as Setters;
  }, [initialState, tempStateRef]);
  const isDirty = useCallback(() => {
    return JSON.stringify(tempStateRef.current) !== JSON.stringify(initialState);
  }, [initialState, tempStateRef]);
  return {
    tempState: tempSettings,
    setters,
    tempSettingsRef: tempStateRef,
    dispatch,
    isDirty,
  };
};
