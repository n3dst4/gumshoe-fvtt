/** @jsx jsx */
import { css, CSSObject, Global, jsx } from "@emotion/react";
import React from "react";

type TrailLogoEditableProps = {
  text: string;
  subtext?: string;
  className?: string,
};

const subtextSyle: CSSObject = {
  fontSize: "0.5em",
};

// const textStyle: CSSObject = {
//   transform: "scaleY(1.4)",
// };

const fontFactor = 48;

/**
 * Outrageous Trail of Cthulhu logo
 */
export const TrailLogoEditable: React.FC<TrailLogoEditableProps> = ({
  text,
  subtext,
  className,
}) => {
  return (
    // outer - set the transform origin
    <div
      className={className}
      css={{
        display: "block",
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
          fontSize: `${Math.min(4, fontFactor / text.length)}em`,
          letterSpacing: "-0.04em",
          whiteSpace: "nowrap",
          transform:
            "rotateY(-30deg) rotateZ(-1deg) translateX(-5%)",
          border: "none",
          // margin: "0.5em",
          padding: 0,
          lineHeight: 1,

        }}
      >
        {/* shadow-bearer */}
        <div
          css={{
            textShadow: "2px 0px 1px black, 6px 3px 4px rgba(0,0,0,0.5)",
            color: "transparent",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100%",
            zIndex: -1,
          }}
        >
          <div>
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
            background: "linear-gradient(to bottom right, #000, #EFB183)",
            backgroundClip: "text",
            color: "transparent",
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "100%",
            // outline: "1px solid red",
            transform: "translate(-50%, -50%)",
          }}
        >
          <div>
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

      </div>

    </div>
  );
};
