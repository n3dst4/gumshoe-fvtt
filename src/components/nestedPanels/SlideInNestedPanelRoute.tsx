import type { PropsWithChildrenAndDirection } from "@lumphammer/minirouter";
import { SlideInRoute } from "@lumphammer/minirouter/animated";
import React from "react";

import { NestedPanel } from "./NestedPanel";

type SlideInNestedPanelRouteProps = PropsWithChildrenAndDirection<{
  className?: string;
}>;

export const SlideInNestedPanelRoute = React.memo<SlideInNestedPanelRouteProps>(
  ({ children, direction, className }) => {
    return (
      <SlideInRoute direction={direction}>
        <NestedPanel className={className}>{children}</NestedPanel>
      </SlideInRoute>
    );
  },
);

SlideInNestedPanelRoute.displayName = "SlideInNestedPanelRoute";
