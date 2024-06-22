import React from "react";

import { useNavigationContext } from "../useNavigationContext";

export const DevTools: React.FC = () => {
  const { currentStep, childSteps, parentSteps } = useNavigationContext();
  return (
    <div css={{ padding: "1em", opacity: 0.5 }}>
      {parentSteps.map((s) => s.direction.id).join("→")}
      {" / "}
      {currentStep?.direction.id ?? "none"}
      {" / "}
      {childSteps.map((s) => s.direction.id).join("→")}
    </div>
  );
};
