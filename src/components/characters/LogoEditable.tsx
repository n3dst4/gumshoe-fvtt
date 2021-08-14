/** @jsx jsx */
import { CSSObject, jsx } from "@emotion/react";
import React, { useContext } from "react";
import { useAsyncUpdate } from "../../hooks/useAsyncUpdate";
import { ThemeContext } from "../../theme";

type LogoEditableProps = {
  text: string,
  subtext?: string,
  defaultSubtext?: string,
  className?: string,
  onChangeText: (newValue: string) => void,
  onChangeSubtext: (newValue: string) => void,
};

const subtextSyle: CSSObject = {
  fontSize: "0.5em",
  padding: "0 1em",
  minHeight: "1em",
};

const textBearerStyle: CSSObject = {
  color: "transparent",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

const fontFactor = 16;

/**
 * Outrageous 1930s logo
 *
 * There is a known bug in Firefox at the time of writing which screws up the
 * rendering https://bugzilla.mozilla.org/show_bug.cgi?id=1720995
 * It's is marked RESOLVED, I've tested in nightly (as of 2021-07-28) and it
 * seems okay, so I'm not going to sweat it.
 */
export const LogoEditable: React.FC<LogoEditableProps> = ({
  text,
  subtext: subtextOrig,
  defaultSubtext = "Investigator",
  className,
  onChangeText: onChangeTextOrig,
  onChangeSubtext: onChangeSubtextOrig,
}) => {
  const subtext = (subtextOrig ?? "").trim();

  const textStyle: CSSObject = {
    transition: "font-size 500ms",
    fontSize: `${Math.min(1, fontFactor / text.length)}em`,
    padding: "0 1em",
  };

  // all the editing logic is done in the hook
  const {
    onInput: onInputText,
    onFocus: onFocusText,
    onBlur: onBlurText,
    contentEditableRef: contentEditableRefText,
    display: displayText,
  } = useAsyncUpdate(text, onChangeTextOrig);

  const {
    onInput: onInputSubtext,
    onFocus: onFocusSubtext,
    onBlur: onBlurSubtext,
    contentEditableRef: contentEditableRefSubtext,
    display: displaySubtext,
  } = useAsyncUpdate(subtext || defaultSubtext, onChangeSubtextOrig);

  const theme = useContext(ThemeContext);

  return (
    // outer - set the transform origin
    <div
      className={className}
      css={{
        display: "block",
        position: "relative",
        height: "6em",
        width: "auto",
        perspective: "500px",
        perspectiveOrigin: "50% 50%",
      }}
    >
      {/* Backdrop */}
      <div
        css={{
          ...theme.logoBackdropStyle,
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        }}
      />
      {/* inner - apply the transform */}
      <div
        className="inner-block"
        css={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          font: theme.displayFont,
          fontSize: "4em",
          whiteSpace: "nowrap",
          transform: theme.logoTransform,
          caretColor: "black",
          border: "none",
          padding: 0,
          lineHeight: 1,
        }}
      >
        {/* shadow-bearer */}
        <div
          className="shadow-bearer"
          css={{
            zIndex: -1,
            ...textBearerStyle,
            ...theme.logoRearElementStyle,
          }}
        >
          <div
            css={{
              ...textStyle,
            }}
          >
            {displayText}
          </div>
          {subtext !== undefined &&
            <div
              css={{
                ...subtextSyle,
              }}
            >
              {displaySubtext}
            </div>
          }
        </div>

        {/* gradient-bearer */}
        {/* This extra div is SOLELY to work around this Firefox bug
          https://bugzilla.mozilla.org/show_bug.cgi?id=1720995
          Basically if you have transform and background-clip: text on the same
          element it cocks up. Bug was introduced in FF90, and as resolved in
          FF92 so I could have ignored it but then again that's not how I roll.
          I have tested this in FF nightlies and it is 100% fixed in FF92. When
          FF92 hits mainline, it will be safe to come back and unwrap this div
          and just apply textBearerStyle on the gradient-bearer div.
          */}
        <div
          css={textBearerStyle}
        >
          <div
            className="gradient-bearer"
            css={{
              // When F92 is mainline, unwrap this div and uncomment this style.
              // ...textBearerStyle,
              ...theme.logoFrontElementStyle,
            }}
            >
            <div
              css={{
                ...textStyle,
              }}
              contentEditable
              ref={contentEditableRefText}
              onInput={onInputText}
              onFocus={onFocusText}
              onBlur={onBlurText}
              />
            {subtext !== undefined &&
              <div
              css={{
                ...subtextSyle,
              }}
              contentEditable
              ref={contentEditableRefSubtext}
              onInput={onInputSubtext}
              onFocus={onFocusSubtext}
              onBlur={onBlurSubtext}
              />
            }
          </div>
        </div>
      </div>
    </div>
  );
};
