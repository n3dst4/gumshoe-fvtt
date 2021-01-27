/** @jsx jsx */
import { css, Global, jsx } from "@emotion/react";
import React from "react";

type CSSResetProps = {
  children: any,
  className?: string,
};

export const CSSReset: React.FC<CSSResetProps> = ({
  className,
  children,
}) => {
  return (
    <div
      css={{
        fontFamily: "'Playfair Display', serif",
        fontWeight: 500,

        // css-reset type stuff
        "*": {
          userSelect: "auto",
        },
        "h1, h2": {
          border: "none",
          margin: 0,
          padding: 0,
          fontWeight: "inherit",
        },
        "button[disabled]": {
          opacity: 0.5,
        },
        ".window-upload-handle": {
          display: "",
        },
        "a:hover, a.hover, .hover a": {
          textShadow: "0 0 0.5em red",
        },
      }}
      className={className}
    >
      <Global
        styles={css`
          @import url('https://fonts.googleapis.com/css2?family=Imbue:wght@300&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
          /* pure hackage to hide these weird buttons until I can work out why they're there */
          .window-upload-handle {
            display: none;
          }
        `}
      />
      {children}
    </div>
  );
};
