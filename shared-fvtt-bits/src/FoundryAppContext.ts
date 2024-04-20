import React from "react";

export const FoundryAppContext = React.createContext<
  Application | foundry.applications.api.ApplicationV2 | null
>(null);
