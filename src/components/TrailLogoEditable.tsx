/** @jsx jsx */
import { css, CSSObject, Global, jsx } from "@emotion/react";
import React, { useRef } from "react";
import { useAsyncUpdate } from "../hooks/useAsyncUpdate";

type TrailLogoEditableProps = {
  text: string;
  subtext?: string;
  className?: string,
  onChange: (newValue: string) => void,
};

const subtextSyle: CSSObject = {
  fontSize: "0.5em",
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
  subtext,
  className,
  onChange,
}) => {
  const textStyle: CSSObject = {
    fontSize: `${Math.min(1, fontFactor / text.length)}em`,
  };

  const editorRef = useRef<HTMLDivElement|null>(null);

  const {
    onInputCb,
    onFocus,
    onBlur,
    // display,
  } = useAsyncUpdate(text, onChange, (newValue) => {
    if (editorRef.current) {
      editorRef.current.innerText = newValue;
    }
  });

  return (
    // outer - set the transform origin
    <div
      className={className}
      css={{
        display: "block",
        position: "relative",
        perspective: "1000px",
        perspectivOrigin: "50% 50%",
        height: "6em",
        width: "auto",
      }}
    >
      <Global
        styles={css`
        @import url('https://fonts.googleapis.com/css2?family=Federo&display=swap');
        `}
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
          fontFamily: "'Federo', sans-serif",
          fontVariant: "small-caps",
          fontSize: "4em",
          letterSpacing: "-0.04em",
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
            textShadow: "2px 0px 1px black, 6px 3px 4px rgba(0,0,0,0.5)",
            zIndex: -1,
            ...textBearerStyle,
          }}
        >
          <div
            css={{
              ...textStyle,
            }}
          >
            {text}
          </div>
          <div
            css={{
              ...subtextSyle,
            }}
          >
            {subtext}
          </div>
        </div>

        {/* gradient-bearer */}
        <div
          css={{
            background: "linear-gradient(to bottom right, #efb183 0%,#222 30%,#efb183 90%)",
            backgroundClip: "text",
            ...textBearerStyle,
          }}
        >
          <div
            css={{
              ...textStyle,
            }}
            contentEditable
            ref={editorRef}
            onInput={onInputCb}
            onFocus={onFocus}
            onBlur={onBlur}
          />
          <div
            css={{
              ...subtextSyle,
            }}
          >
            {subtext}
          </div>
        </div>
      </div>
    </div>
  );
};
