import { createContext } from "react";

import type {
  MagicToolbarContent,
  MagicToolbarRegisterContextDataValue,
} from "./types";

export const MagicToolbarContentContext = createContext<MagicToolbarContent>(
  {},
);

export const MagicToolbarRegisterContext =
  createContext<MagicToolbarRegisterContextDataValue>({
    register: () => {},
    unregister: () => {},
  });
