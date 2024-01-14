import React from "react";

interface ImageEditorProps {
  page: any;
}

export const ImageEditor: React.FC<ImageEditorProps> = ({ page }) => {
  return (
    <div>
      {page.name}
      <img
        css={{
          cursor: "pointer",
          ":hover": {
            opacity: 0.5,
          },
        }}
        src={page.src}
        onClick={() => {
          page.sheet.render(true);
        }}
      />
    </div>
  );
};

ImageEditor.displayName = "ImageEditor";
