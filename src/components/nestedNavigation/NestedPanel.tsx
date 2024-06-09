import React, { memo, PropsWithChildren, useContext } from "react";
import { FaXmark } from "react-icons/fa6";

import { ThemeContext } from "../../themes/ThemeContext";
import { panelMargin } from "./constants";
import { SafeLink } from "./SafeLink";
import { SlideInOutlet } from "./SlideInOutlet";
import { useFamilyPaths } from "./useFamilyPaths";

export const NestedPanel = memo(
  ({ children, routeId }: PropsWithChildren<{ routeId: string }>) => {
    const theme = useContext(ThemeContext);
    const { parentPath } = useFamilyPaths(routeId);
    return (
      <>
        {/* add this to block clicks to the parent */}
        {/* <div
        className="left-spacer"
        css={{
          position: "absolute",
          top: 0,
          width: panelMargin,
          bottom: 0,
          left: 0,
        }}
      /> */}
        <div
          className="solid-panel"
          css={{
            position: "absolute",
            top: 0,
            left: panelMargin,
            right: 0,
            bottom: 0,
            padding: "1em",
            backgroundColor: theme.colors.bgOpaquePrimary,
            boxShadow: `0 0 ${panelMargin} 0 #0007`,
            overflow: "auto",
            borderLeft: `1px solid ${theme.colors.controlBorder}`,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div className="nav-bar">
            <SafeLink to={parentPath ?? "/"}>
              <FaXmark />
            </SafeLink>
          </div>
          {/* actual children */}
          <div className="children-box" css={{ flex: 1 }}>
            {children}
          </div>
          {/* outlet */}
          <SlideInOutlet routeId={routeId} />
        </div>
      </>
    );
  },
);

NestedPanel.displayName = "NestedPanel";
