/** @jsx jsx */
import { CSSObject, jsx } from "@emotion/react";
import React from "react";
import { useAsyncUpdate } from "../hooks/useAsyncUpdate";

type TrailLogoEditableProps = {
  text: string;
  subtext?: string;
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
export const TrailLogoEditable: React.FC<TrailLogoEditableProps> = ({
  text,
  subtext: subtextOrig,
  defaultSubtext = "Investigator",
  className,
  onChangeText: onChangeTextOrig,
  onChangeSubtext: onChangeSubtextOrig,
}) => {
  const subtext = subtextOrig.trim();

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

  return (
    // outer - set the transform origin
    <div
      className={className}
      css={{
        display: "block",
        position: "relative",
        perspective: "500px",
        perspectiveOrigin: "50% 50%",
        height: "6em",
        width: "auto",
      }}
    >
      {/* inner - apply the transform */}
      <div
        className="inner-block"
        css={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          fontFamily: "'Federo', sans-serif",
          fontVariant: "small-caps",
          fontSize: "4em",
          // letterSpacing: "-0.04em",
          whiteSpace: "nowrap",
          transform: "rotateY(-30deg) rotateZ(-1deg) translateX(-5%)",
          caretColor: "black",
          border: "none",
          padding: 0,
          lineHeight: 1,

        }}
      >
        {/* shadow-bearer */}
        <div
          css={{
            textShadow: "2px 0px 1px black, 6px 0px 4px rgba(0,0,0,0.5), -1px 0px 0px rgba(255,255,255,0.5)",
            zIndex: -1,
            ...textBearerStyle,
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
          css={{
            background:
              "linear-gradient(135deg, #efb183 0%,#222 30%,#efb183 90%)",
            backgroundClip: "text",
            ...textBearerStyle,
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
