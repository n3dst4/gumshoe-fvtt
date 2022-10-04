import { createContext } from "react";
import { getSettingsDict, SettingsDict } from "../../settings";

export const DispatchContext = createContext<React.Dispatch<any>>(() => {});
export const SettingsContext = createContext<SettingsDict>(getSettingsDict());
