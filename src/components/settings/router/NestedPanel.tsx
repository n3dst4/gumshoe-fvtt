import React, { memo, PropsWithChildren, useContext } from "react";
import { FaXmark } from "react-icons/fa6";

import { Link } from "../../../minirouter/components/Link";
import { ThemeContext } from "../../../themes/ThemeContext";

const panelMargin = "3em";

export const NestedPanel = memo<PropsWithChildren>(({ children }) => {
  const theme = useContext(ThemeContext);
  return (
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
        pointerEvents: "all",
      }}
    >
      <div className="nav-bar">
        <Link to="up">
          <FaXmark />
        </Link>
      </div>
      {/* actual children */}
      <div className="children-box" css={{ flex: 1 }}>
        {children}
      </div>
    </div>
  );
});

NestedPanel.displayName = "NestedPanel";
