import { useMatches } from "react-router-dom";

export function useFamilyPaths(routeId: string) {
  const matches = useMatches();
  const matchIndex = matches.findIndex((m) => m.id === routeId);
  const parentMatch = matchIndex > 0 ? matches[matchIndex - 1] : undefined;
  const parentPath = parentMatch?.pathname ?? null;
  const childMatch = matchIndex >= 0 ? matches[matchIndex + 1] : undefined;
  const childPath = childMatch?.pathname ?? null;

  return {
    parentPath,
    childPath,
  };
}
