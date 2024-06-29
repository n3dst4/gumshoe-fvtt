import { useContext } from "react";

import { NavigationContext } from "./NavigationContext";

export function useNavigationContext() {
  const context = useContext(NavigationContext);
  if (context === null) {
    throw new Error("useNavigationContext must be used within a Router");
  }
  return context;
}
