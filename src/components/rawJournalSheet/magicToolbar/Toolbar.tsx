import React from "react";

type ToolbarProps = React.PropsWithChildren<{
  header?: React.ReactNode;
}>;

export const Toolbar: React.FC<ToolbarProps> = ({ children, header }) => {
  return (
    <div
      css={{
        display: "grid",
        gridTemplateRows: "auto 1fr",
        // padding: "0.5em",
      }}
    >
      {header}asdas
      <div
        css={{
          display: "flex",
          flexDirection: "row",
          gap: "0.5em",
        }}
      >
        {children}
      </div>
    </div>
  );
};

Toolbar.displayName = "Toolbar";
