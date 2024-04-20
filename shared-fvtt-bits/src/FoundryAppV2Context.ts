import React from "react";

export const FoundryAppV2Context =
  React.createContext<foundry.applications.api.ApplicationV2 | null>(null);
