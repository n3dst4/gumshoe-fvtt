import React from "react";

import { HTMLEditor } from "./HTMLEditor";
import { ImageEditor } from "./ImageEditor";

interface PageEditorProps {
  page: any;
}

export const PageEditor: React.FC<PageEditorProps> = ({ page }) => {
  switch (page.type) {
    case "image":
      return <ImageEditor page={page} />;
    case "text":
      return <HTMLEditor page={page} />;
    default:
      return <div>Unknown Page Type</div>;
  }
};

PageEditor.displayName = "PageEditor";
