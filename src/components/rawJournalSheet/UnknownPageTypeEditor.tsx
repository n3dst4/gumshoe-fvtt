import React from "react";

import { absoluteCover } from "../absoluteCover";

interface UnknownPageTypeEditorProps {
  page: any;
}

export const UnknownPageTypeEditor: React.FC<UnknownPageTypeEditorProps> = ({
  page,
}) => {
  return (
    <div
      css={{
        ...absoluteCover,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "1.5em",
        // color: "gray",
      }}
    >
      <button css={{ width: "auto" }} onClick={() => page.sheet.render(true)}>
        Open {page.type} page
      </button>
    </div>
  );
};

UnknownPageTypeEditor.displayName = "UnknownPageTypeEditor";
