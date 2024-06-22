import React from "react";

import { NavigationContextValue } from "./types";

/**
 * This is the core context that makes everything happen.
 */
export const NavigationContext =
  React.createContext<NavigationContextValue | null>(null);
