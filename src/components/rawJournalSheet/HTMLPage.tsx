import React from "react";

import { HTMLEditor } from "./HTMLEditor";

interface HTMLPageProps {
  page: any;
}

export const HTMLPage: React.FC<HTMLPageProps> = ({ page }) => {
  return (
    <div
      data-testid="editor"
      css={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "0.5em",
      }}
    >
      <div
        data-testid="main-area"
        css={{
          flex: 1,
        }}
      >
        <HTMLEditor page={page} />
      </div>
    </div>
  );
};

HTMLPage.displayName = "Editor";
