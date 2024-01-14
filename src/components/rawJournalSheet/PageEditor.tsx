import React from "react";

import { HTMLPage } from "./HTMLPage";
import { ImagePage } from "./ImagePage";

interface PageEditorProps {
  page: any;
}

export const PageEditor: React.FC<PageEditorProps> = ({ page }) => {
  switch (page.type) {
    case "image":
      return <ImagePage page={page} />;
    case "text":
      return <HTMLPage page={page} />;
    default:
      return <div>Unknown Page Type</div>;
  }
};

PageEditor.displayName = "PageEditor";
