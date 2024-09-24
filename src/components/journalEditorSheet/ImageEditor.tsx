import React from "react";

import { absoluteCover } from "../absoluteCover";

interface ImageEditorProps {
  page: any;
}

/**
 * A basic image page. Delegates to Foundry's native editor to do the heavy
 * lifting.
 */
export const ImageEditor = ({ page }: ImageEditorProps) => {
  return (
    <div
      data-testid="image-container"
      css={{
        ...absoluteCover,
        overflow: "hidden",
        textAlign: "center",
      }}
    >
      <a
        css={{
          margin: "auto",
        }}
        onClick={() => {
          page.sheet.render(true);
        }}
      >
        {page.src ? (
          <img
            css={{
              cursor: "pointer",
              ":hover": {
                opacity: 0.5,
              },
              maxWidth: "100%",
              maxHeight: "100%",
            }}
            src={page.src}
          />
        ) : (
          "Click to add image"
        )}
      </a>
    </div>
  );
};

ImageEditor.displayName = "ImageEditor";
