/** @jsx jsx */
import { css, Global, jsx } from "@emotion/react";
import React, { useState } from "react";
import { ThemeContext, trailTheme } from "../theme";

type CSSResetProps = {
  children: any;
  className?: string;
};

export const CSSReset: React.FC<CSSResetProps> = ({ className, children }) => {
  const [theme, setTheme] = useState(trailTheme);

  return (
    <ThemeContext.Provider value={[theme, setTheme]}>
      <Global
        styles={css`
          @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");
          @import url("https://fonts.googleapis.com/css2?family=Federo&display=swap");
          @import url('https://fonts.googleapis.com/css2?family=Caveat&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap');    
          @import url('https://fonts.googleapis.com/css2?family=Patrick+Hand+SC&display=swap');
          /* pure hackage to hide these weird buttons until I can work out why they're there */
          .window-upload-handle {
            display: none;
          }
        `}
      />
      <div
        className={className}
        css={{
          "*": {
            // all: "initial",
            scrollbarWidth: "thin",
            userSelect: "auto",
            boxSizing: "border-box",
            scrollbarColor: `${theme.colors.accent} ${theme.colors.darken}`,
          },
          font: theme.bodyFont,
          background: `${theme.colors.wallpaper} ${theme.wallpaper}`,
          backgroundSize: "cover",
          padding: "0.5em",
          color: theme.colors.text,

          "h1, h2, h3, h4": {
            border: "none",
            margin: "0.3em 0 0 0",
            padding: 0,
            fontWeight: "inherit",
            font: theme.displayFont,
          },
          h1: {
            fontSize: "1.5em",
          },
          h2: {
            fontSize: "1.3em",
          },
          h3: {
            fontSize: "1.1em",
          },
          h4: {
            fontSize: "1em",
          },
          button: {
            // margin: 0,
            font: theme.displayFont,
            color: theme.colors.accent,
            "&[disabled]": {
              opacity: 0.5,
            },
            ":hover": {
              // borderStyle: "outset",
              boxShadow: `0 0 0.5em ${theme.colors.glow}`,
              textShadow: `0 0 0.5em ${theme.colors.glow}`,
            },
          },
          label: {
            font: theme.displayFont,
          },
          a: {
            color: theme.colors.accent,
          },
          "a:hover, a.hover, .hover a": {
            textDecoration: "underline",
            textShadow: `0 0 0.5em ${theme.colors.glow}`,
          },
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
