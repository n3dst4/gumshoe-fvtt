import { ReactNode } from "react";

export type MagicToolbarContentEntry = {
  sort: number;
  content: ReactNode;
};
export type MagicToolbarContent = Record<string, MagicToolbarContentEntry>;
export type MagicToolBarRegister = (
  id: string,
  content: MagicToolbarContentEntry,
) => void;
export type MagicToolBarUnregister = (id: string) => void;
export type MagicToolbarRegisterContextDataValue = {
  register: MagicToolBarRegister;
  unregister: MagicToolBarUnregister;
};
