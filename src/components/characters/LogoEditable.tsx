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
 * Outrageous Trail of Cthulhu logo
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
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          ...theme.logoBackdropStyle,
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
        <div
          className="gradient-bearer"
          css={{
            ...textBearerStyle,
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
  );
};
