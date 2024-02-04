import React, { Fragment, useContext } from "react";

import { MagicToolbarContentContext } from "./contexts";
import { Toolbar } from "./Toolbar";

interface MagicToolbarProps extends React.PropsWithChildren {}

/**
 * Render the actual toolbar. Children content will be rendered first. If you
 * want to provide more content woth sorting options, use a samll wrapper
 * component which calls useToolbarContent.
 */
export const MagicToolbar: React.FC<MagicToolbarProps> = ({ children }) => {
  const content = Object.values(useContext(MagicToolbarContentContext))
    .sort((a, b) => a.sort - b.sort)
    .map((c, i) => <Fragment key={i}>{c.content} </Fragment>);
  return (
    <Toolbar>
      {children}
      {content}
    </Toolbar>
  );
};

MagicToolbar.displayName = "MagicToolbar";
