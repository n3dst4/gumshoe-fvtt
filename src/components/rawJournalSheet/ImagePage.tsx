import React from "react";

interface ImagePageProps {
  page: any;
}

export const ImagePage: React.FC<ImagePageProps> = ({ page }) => {
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

ImagePage.displayName = "ImageEditor";
