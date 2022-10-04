import { useCallback, useMemo, useReducer } from "react";
import { customSystem } from "../../constants";
import { useRefStash } from "../../hooks/useRefStash";
import { getSettingsDict } from "../../settings";
import { reducer, setAll } from "./reducer";
import { Setters } from "./types";

export const useTempSettings = () => {
  const initial = useMemo(getSettingsDict, []);
  const [tempSettings, dispatch] = useReducer(reducer, initial);
  const tempSettingsRef = useRefStash(tempSettings);
  const setters = useMemo(() => {
    const setters: Record<string, any> = {};
    for (const k of Object.keys(initial)) {
      setters[k] = (newVal: any) => {
        dispatch(
          setAll.create({
            newSettings: {
              ...tempSettingsRef.current,
              [k]: newVal,
              systemPreset: customSystem,
            },
          }),
        );
      };
    }
    return setters as Setters;
  }, [initial, tempSettingsRef]);
  const isDirty = useCallback(() => {
    return JSON.stringify(tempSettingsRef.current) !== JSON.stringify(initial);
  }, [initial, tempSettingsRef]);
  return { tempSettings, setters, tempSettingsRef, dispatch, isDirty };
};
