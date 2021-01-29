/** @jsx jsx */
import { css, Global, jsx } from "@emotion/react";
import React from "react";
import system from "../system.json";

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
        // fontWeight: 500,
        background: `url(systems/${system.name}/assets/marjanblan-5Ft4NWTmeJE-unsplash.jpg)`,
        backgroundSize: "cover",
        padding: "0.5em",
        // css-reset type stuff
        "*": {
          userSelect: "auto",
          scrollbarWidth: "thin",
        },
        "h1, h2, h3, h4": {
          border: "none",
          margin: 0,
          padding: 0,
          fontWeight: "inherit",
          fontFamily: "'Federo', serif",
        },
        button: {
          // margin: 0,
          fontFamily: "'Federo', serif",
          "&[disabled]": {
            opacity: 0.5,
          },
        },
        label: {
          fontFamily: "'Federo', serif",
        },
        ".window-upload-handle": {
          display: "",
        },
        a: {
          color: "#700",
        },
        "a:hover, a.hover, .hover a": {
          textDecoration: "underline",
          textShadow: "0 0 0.5em red",
        },
      }}
      className={className}
    >
      <Global
        styles={css`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Federo&display=swap');
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
