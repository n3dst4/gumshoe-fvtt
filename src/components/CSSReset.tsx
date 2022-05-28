/** @jsx jsx */
import { CacheProvider as EmotionCacheProvider, Global, jsx } from "@emotion/react";
import React, {
  createContext,
  ReactNode,
  // useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { css } from "@emotion/css";
import { ThemeContext } from "../themes/ThemeContext";
import { ThemeV1 } from "../themes/types";
import createCache from "@emotion/cache";

export enum CSSResetMode {
  large="large",
  small="small"
}

type CSSResetProps = {
  children: ReactNode,
  className?: string,
  theme: ThemeV1,
  mode: CSSResetMode,
  noStyleAppWindow?: boolean,
  domNode?: HTMLElement,
};

export const CSSResetDOMNodeContext = createContext<HTMLElement>(document.body);

export const CSSReset: React.FC<CSSResetProps> = ({
  className,
  children,
  theme,
  mode,
  noStyleAppWindow = false,
}: CSSResetProps) => {
  const ref = useRef<HTMLDivElement>(null);

  // const el = useContext(CSSResetDOMNodeContext);

  const [el, setEl] = useState(ref.current);

  if (el === null && ref.current !== null) {
    setEl(ref.current);
  }

  const cache = useMemo(
    () => {
      logger.log("generating cache", el);
      const thisBody = el?.closest("body");
      return createCache({
        key: "hello",
        container: thisBody ?? undefined,
        // prepend: true,
      });
    }, [el]);

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

  const rootStyle = (mode === CSSResetMode.large ? theme.largeSheetRootStyle : theme.smallSheetRootStyle);

  return (
    <EmotionCacheProvider value={cache}>
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
            accentColor: theme.colors.accent,
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
            "input, input[type=text], textarea, select, option": {
              font: theme.bodyFont,
              fontVariantLigatures: "none",
              color: theme.colors.accent,
              padding: "0.1em 0.3em",
              borderStyle: "solid",
              borderWidth: "1px",
              borderColor: theme.colors.controlBorder,
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
              border: `2px groove ${theme.colors.controlBorder}`,
              background: theme.colors.backgroundButton,
            },
            hr: {
              borderColor: theme.colors.controlBorder,
            },
            "i.fa:last-child": {
              margin: 0,
            },
            ...rootStyle,

          }}
        >
          {children}
        </div>
      </ThemeContext.Provider>
    </EmotionCacheProvider>
  );
};
