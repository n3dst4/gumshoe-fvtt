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
    register: () => {
      // do nothing if out of context
      // XXX should throw
    },
    unregister: () => {
      // do nothing if out of context
      // XXX should throw
    },
  });
