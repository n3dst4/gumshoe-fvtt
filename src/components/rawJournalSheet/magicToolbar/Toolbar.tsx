import React from "react";

type ToolbarProps = React.PropsWithChildren;

export const Toolbar: React.FC<ToolbarProps> = ({ children }) => {
  return (
    <div
      css={{
        display: "grid",
        gridTemplateRows: "auto 1fr",
        justifyContent: "start",
        columnGap: "1em",
        rowGap: "0.5em",
        // padding: "0.5em",
      }}
    >
      {children}
    </div>
  );
};

Toolbar.displayName = "Toolbar";
