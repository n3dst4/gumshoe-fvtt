import type { PropsWithChildrenAndDirection } from "@lumphammer/minirouter";
import { SlideInRoute } from "@lumphammer/minirouter/animated";
import React from "react";

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
