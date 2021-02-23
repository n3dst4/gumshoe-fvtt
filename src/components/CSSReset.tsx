/** @jsx jsx */
import { Global, jsx } from "@emotion/react";
import React from "react";
import { ThemeContext, Theme } from "../theme";

type CSSResetProps = {
  children: any;
  className?: string;
  theme: Theme;
};

export const CSSReset: React.FC<CSSResetProps> = ({ className, children, theme }) => {
  return (
    <ThemeContext.Provider value={theme}>
      <Global styles={theme.global} />
      <div
        className={className}
        css={{
          "*": {
            // all: "initial",
            scrollbarWidth: "thin",
            userSelect: "auto",
            boxSizing: "border-box",
            scrollbarColor: `${theme.colors.accent} ${theme.colors.reverseThin}`,
            "&:focus": {
              textDecoration: "underline",
              // textDecorationStyle: "dashed",
            },
          },
          font: theme.bodyFont,
          background: `${theme.colors.wallpaper} ${theme.wallpaper}`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          // backgroundBlendMode: "hard-light",
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
            font: theme.displayFont,
            color: theme.colors.accent,
            "&[disabled]": {
              opacity: 0.5,
              color: theme.colors.text,
              "&:hover": {
                boxShadow: "none",
                textShadow: "none",
              },
            },
            "&:hover": {
              boxShadow: `0 0 0.5em ${theme.colors.glow}`,
              textShadow: `0 0 0.5em ${theme.colors.glow}`,
            },
            "&:focus": {
              boxShadow: "none",
            },
          },
          label: {
            font: theme.displayFont,
          },
          "a, label.parp": {
            color: theme.colors.accent,
          },
          "a:hover, a.hover, .hover a, label.parp:hover, label.parp.hover, .hover label.parp": {
            textDecoration: "underline",
            textShadow: `0 0 0.5em ${theme.colors.glow}`,
          },
          "input, input[type=text], textarea": {
            font: theme.bodyFont,
            fontVariantLigatures: "none",
            color: theme.colors.accent,
            padding: "0.1em 0.3em",
            borderStyle: "solid",
            borderWidth: "1px",
            borderColor: theme.colors.reverseMedium,
            background: theme.colors.medium,
            resize: "vertical",
            ":focus": {
              borderColor: theme.colors.accent,
              outline: "none",
              boxShadow: `0 0 0.5em ${theme.colors.glow}`,
            },
          },
          select: {
            ":focus": {
              borderColor: theme.colors.accent,
              outline: "none",
              boxShadow: `0 0 0.5em ${theme.colors.glow}`,
            },
          },
          textarea: {
            lineHeight: 1,
          },
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
