/** @jsx jsx */
import { Global, jsx } from "@emotion/react";
import React, { ReactNode, useEffect, useRef } from "react";
import { Theme } from "../themes/types";
import { css } from "@emotion/css";
import { ThemeContext } from "../themes/ThemeContext";

export enum CSSResetMode {
  large="large",
  small="small"
}

type CSSResetProps = {
  children: ReactNode,
  className?: string,
  theme: Theme,
  mode: CSSResetMode,
  noStyleAppWindow?: boolean,
};

export const CSSReset: React.FC<CSSResetProps> = ({
  className,
  children,
  theme,
  mode,
  noStyleAppWindow = false,
}: CSSResetProps) => {
  const ref = useRef<HTMLDivElement>(null);

  // add app window styles if there's a continaing app window
  useEffect(() => {
    // interacting with Foundry's stuff with jQuery feels a bit 2001 but putting
    // it in a hook keeps is nice and encapsulated.
    const className = css(theme.appWindowStyle);
    if (ref.current !== null && !noStyleAppWindow) {
      const el = jQuery(ref.current).closest(".window-app");
      el.addClass(className);
      return function () {
        el.removeClass(className);
      };
    }
  }, [noStyleAppWindow, theme.appWindowStyle]);

  return (
    <ThemeContext.Provider value={theme}>
      <Global styles={theme.global} />
      <div
        ref={ref}
        className={className}
        css={{
          font: theme.bodyFont,
          padding: "0.5em",
          color: theme.colors.text,
          backgroundColor: theme.colors.wallpaper,
          height: "100%",
          ...(mode === CSSResetMode.large ? theme.largeSheetRootStyle : theme.smallSheetRootStyle),

          "*": {
            // all: "initial",
            scrollbarWidth: "thin",
            userSelect: "auto",
            boxSizing: "border-box",
            scrollbarColor: `${theme.colors.accent} ${theme.colors.backgroundButton}`,
            "&:focus": {
              textDecoration: "underline",
            },
          },

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
            borderColor: theme.colors.text,
            background: theme.colors.backgroundPrimary,
            resize: "vertical",
            ":focus": {
              borderColor: theme.colors.accent,
              outline: "none",
              boxShadow: `0 0 0.5em ${theme.colors.glow}`,
            },
          },
          select: {
            color: theme.colors.text,
            background: theme.colors.backgroundPrimary,
            option: {
              background: theme.colors.backgroundPrimary,
            },
            ":focus": {
              borderColor: theme.colors.accent,
              outline: "none",
              boxShadow: `0 0 0.5em ${theme.colors.glow}`,
            },
          },
          textarea: {
            lineHeight: 1,
          },
          "button, input[type=button]": {
            border: `2px groove ${theme.colors.text}`,
            background: theme.colors.backgroundButton,
          },
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
