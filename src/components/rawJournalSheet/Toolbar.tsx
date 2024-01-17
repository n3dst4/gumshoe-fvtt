import React from "react";

type ToolbarProps = React.PropsWithChildren<{
  header?: React.ReactNode;
}>;

export const Toolbar: React.FC<ToolbarProps> = ({ children, header }) => {
  return (
    <div
      css={{
        display: "flex",
        flexDirection: "column",
        // padding: "0.5em",
      }}
    >
      {header}
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
