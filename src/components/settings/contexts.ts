import { createContext } from "react";
import { getSettingsDict } from "../../settings";
import { State } from "./types";

/**
 * Context for settings dispatch funtion
 */
export const DispatchContext = createContext<React.Dispatch<any>>(() => {});

/**
 * Context for settings state
 * We put settings in an object instead of just having it be the top-level state
 * directly so there's room for expansion if we ever what more things in state
 */
export const StateContext = createContext<State>({
  settings: getSettingsDict(),
});
