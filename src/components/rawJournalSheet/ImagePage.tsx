import React from "react";

interface ImagePageProps {
  page: any;
}

export const ImagePage: React.FC<ImagePageProps> = ({ page }) => {
  return (
    <div>
      <div>{page.name}</div>
      <a
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

ImagePage.displayName = "ImageEditor";
