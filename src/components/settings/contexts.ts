import { createContext } from "react";
import { getSettingsDict } from "../../settings";
import { State } from "./types";

export const DispatchContext = createContext<React.Dispatch<any>>(() => {});
export const StateContext = createContext<State>({ settings: getSettingsDict() });
