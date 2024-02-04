import React, { Fragment, ReactNode, useContext } from "react";

import { MagicToolbarContentContext } from "./contexts";
import { Toolbar } from "./Toolbar";

interface MagicToolbarProps extends React.PropsWithChildren {
  categories: string[];
}

/**
 * Render the actual toolbar. Children content will be rendered first. If you
 * want to provide more content woth sorting options, use a samll wrapper
 * component which calls useToolbarContent.
 */
export const MagicToolbar: React.FC<MagicToolbarProps> = ({
  children,
  categories,
}) => {
  // get all the content that's been registered, and group them by category
  const registeredContent = Object.values(
    useContext(MagicToolbarContentContext),
  );
  const groupedContent: Record<string, ReactNode[]> = {};
  for (const entry of registeredContent) {
    if (groupedContent[entry.category] === undefined) {
      groupedContent[entry.category] = [];
    }
    groupedContent[entry.category].push(entry.content);
  }

  // produce a list of all the actual categories, sorted to match the order of
  // the categories prop
  const sortedCategories = Object.keys(groupedContent).sort((a, b) => {
    return categories.indexOf(a) - categories.indexOf(b);
  });

  const content = sortedCategories.map((category, index) => {
    return (
      <Fragment key={category}>
        <div
          css={{ gridRow: 1, gridColumn: index + 1, borderBottom: "1px solid" }}
        >
          {category}
        </div>
        <div
          css={{
            gridRow: 2,
            gridColumn: index + 1,
            display: "flex",
            flexDirection: "row",
            gap: "0.5em",
          }}
        >
          {groupedContent[category]}
        </div>
      </Fragment>
    );
  });
  return (
    <div
      css={{
        display: "grid",
        gridTemplateRows: "auto 1fr",
        justifyContent: "start",
        columnGap: "1em",
        rowGap: "0.5em",
      }}
    >
      {/* {children} */}
      {content}
    </div>
  );
};

MagicToolbar.displayName = "MagicToolbar";
