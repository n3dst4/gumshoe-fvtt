import { DevTools, Link } from "@lumphammer/minirouter";
import React, { memo, PropsWithChildren, useContext } from "react";
import { FaArrowLeft } from "react-icons/fa6";

import { ThemeContext } from "../../themes/ThemeContext";

const defaultPanelMargin = "3em";

type NestedPanelProps = PropsWithChildren<{
  className?: string;
  margin?: string | number;
}>;

export const NestedPanel = memo<NestedPanelProps>(
  ({ children, className, margin = defaultPanelMargin }) => {
    const theme = useContext(ThemeContext);
    return (
      <div
        className={className}
        css={{
          position: "absolute",
          top: 0,
          left: margin,
          right: 0,
          bottom: 0,
          padding: "1em",
          backgroundColor: theme.colors.bgOpaquePrimary,
          boxShadow: `0 0 min(${margin}, ${defaultPanelMargin}) 0 #0007`,
          overflow: "auto",
          borderLeft: `1px solid ${theme.colors.controlBorder}`,
          display: "flex",
          flexDirection: "column",
          pointerEvents: "all",
        }}
      >
        <div className="nav-bar">
          <Link to="up">
            <FaArrowLeft /> <span css={{ verticalAlign: "top" }}>Back</span>
          </Link>
        </div>
        {/* actual children */}
        <div className="children-box" css={{ flex: 1, paddingTop: "1em" }}>
          {children}
        </div>
        {false && <DevTools />}
        {/* <DevTools /> */}
      </div>
    );
  },
);

NestedPanel.displayName = "NestedPanel";
