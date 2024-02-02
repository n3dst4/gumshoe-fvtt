import React from "react";

import { absoluteCover } from "../absoluteCover";

interface ImagePageProps {
  page: any;
}

export const ImagePage: React.FC<ImagePageProps> = ({ page }) => {
  return (
    <div
      data-testid="image-container"
      css={{
        ...absoluteCover,
        overflow: "hidden",
        // display: "flex",
        // justifyContent: "center",
        // alignItems: "center",
        textAlign: "center",
      }}
    >
      <a
        css={{
          // maxWidth: "100%",
          // maxHeight: "100%",
          margin: "auto",
          // display: "block",
          // flexBasis: "max-content",
          // height: "100%",
          // width: "100%",
          // cursor: "pointer",
          // ":hover": {
          //   opacity: 0.5,
          // },
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

ImagePage.displayName = "ImageEditor";
