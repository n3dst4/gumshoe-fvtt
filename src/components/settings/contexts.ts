import { createContext } from "react";

import { getSettingsDict } from "../../settings/settings";
import { State } from "./types";

/**
 * Context for settings dispatch funtion
 */
export const DispatchContext = createContext<React.Dispatch<any>>(() => {
  // do nothing if out of context
  // XXX should throw
});

/**
 * Context for settings state
 * We put settings in an object instead of just having it be the top-level state
 * directly so there's room for expansion if we ever what more things in state
 */
export const StateContext = createContext<State>({
  settings: getSettingsDict(),
});

/**
 * Context for whether the settings are dirty
 */
export const DirtyContext = createContext<() => boolean>(() => false);
