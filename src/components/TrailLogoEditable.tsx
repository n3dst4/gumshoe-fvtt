/** @jsx jsx */
import { css, CSSObject, Global, jsx } from "@emotion/react";
import React from "react";
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

  const {
    onChangeCb,
    onFocus,
    onBlur,
    display,
  } = useAsyncUpdate(text, onChange);

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
          textTransform: "uppercase",
          fontSize: "4em",
          letterSpacing: "-0.04em",
          whiteSpace: "nowrap",
          transform: "rotateY(-30deg) rotateZ(-1deg) translateX(-5%)",
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
            {display}
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
          data-content={display}
          css={{
            background: "linear-gradient(to bottom right, #efb183 0%,#222 30%,#efb183 90%)",
            backgroundClip: "text",
            ...textBearerStyle, //
            ...textStyle,
            "::after": {
              content: "attr(data-content)",
            },
          }}
        >
          <input
            value={display}
            onChange={onChangeCb}
            onFocus={onFocus}
            onBlur={onBlur}
            data-lpignore="true"
            css={{
              ...textStyle,
              background: "inherit",
              backgroundClip: "inherit",
              fontFamily: "inherit",
              textTransform: "inherit",
              border: "none",
              textAlign: "inherit",
              letterSpacing: "inherit",
              margin: 0,
              padding: 0,
              color: "inherit",
              // color: "red",
              lineHeight: "inherit",
              width: "100%",
              position: "absolute",
            }}
          />
          {/* <div
            css={{
              ...textStyle,
            }}
          >
            {text}
          </div> */}
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
