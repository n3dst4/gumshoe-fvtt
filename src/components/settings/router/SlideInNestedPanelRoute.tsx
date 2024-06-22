import React from "react";

import { SlideInRoute } from "../../../minirouter/animated/SlideInRoute";
import { PropsWithChildrenAndDirection } from "../../../minirouter/types";
import { NestedPanel } from "./NestedPanel";

export const SlideInNestedPanelRoute =
  React.memo<PropsWithChildrenAndDirection>(({ children, direction }) => {
    return (
      <SlideInRoute direction={direction}>
        <NestedPanel>{children}</NestedPanel>
      </SlideInRoute>
    );
  });

SlideInNestedPanelRoute.displayName = "SlideInNestedPanelRoute";
