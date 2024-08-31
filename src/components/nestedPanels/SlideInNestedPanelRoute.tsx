import {
  type PropsWithChildrenAndDirection,
  useNavigationContext,
} from "@lumphammer/minirouter";
import { SlideInRoute } from "@lumphammer/minirouter/animated";
import React from "react";

import { absoluteCover } from "../absoluteCover";
import { NestedPanel } from "./NestedPanel";

type SlideInNestedPanelRouteProps = PropsWithChildrenAndDirection<{
  className?: string;
  margin?: string | number;
  closeOnClickOutside?: boolean;
}>;

const BlurPanel: React.FC = () => {
  const { navigate } = useNavigationContext();
  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        navigate("here", "up");
      }}
      css={{
        ...absoluteCover,
        pointerEvents: "all",
      }}
    />
  );
};

export const SlideInNestedPanelRoute = React.memo<SlideInNestedPanelRouteProps>(
  ({ children, direction, className, margin, closeOnClickOutside }) => {
    return (
      <SlideInRoute
        direction={direction}
        backdropContent={closeOnClickOutside ? <BlurPanel /> : undefined}
      >
        <NestedPanel className={className} margin={margin}>
          {children}
        </NestedPanel>
      </SlideInRoute>
    );
  },
);

SlideInNestedPanelRoute.displayName = "SlideInNestedPanelRoute";
