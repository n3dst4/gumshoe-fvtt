import React, { PropsWithChildren, useMemo, useState } from "react";

import { NavigationContext } from "../NavigationContext";
import { AnyStep, NavigationContextValue } from "../types";

export const Router: React.FC<PropsWithChildren> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState<AnyStep[]>([]);
  const navigationContextValue = useMemo<NavigationContextValue>(
    () => ({
      navigate: (from, to) => {
        const isUp = to === "up";
        const toArray = isUp ? [] : Array.isArray(to) ? to : [to];
        setCurrentPath((currentPath) => {
          let newPath: AnyStep[];
          if (from === "root" || from === "here") {
            newPath = toArray;
          } else {
            const fromIndex = currentPath.findLastIndex(
              (step) => step.direction === from,
            );
            if (fromIndex === -1) {
              throw new Error(`Cannot navigate from ${from.description}`);
            }
            return [...currentPath.slice(0, fromIndex + 1), ...toArray];
          }
          if (to === "up") {
            if (newPath.length === 0) {
              throw new Error("Cannot navigate up from root (says Router)");
            }
            newPath = currentPath.slice(0, currentPath.length - 1);
          }
          return newPath;
        });
      },
      currentStep: currentPath[0],
      parentSteps: [],
      childSteps: currentPath.slice(1),
    }),
    [currentPath],
  );
  return (
    <NavigationContext.Provider value={navigationContextValue}>
      {children}
    </NavigationContext.Provider>
  );
};
