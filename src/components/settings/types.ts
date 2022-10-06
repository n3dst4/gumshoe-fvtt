import { SettingsDict } from "../../settings";

export type Setters = { [k in keyof SettingsDict]: ((newVal: SettingsDict[k]) => void)};

export interface State {
  settings: SettingsDict;
}
