/** @jsx jsx */
import { css, Global, jsx } from "@emotion/react";
import React from "react";

type TrailLogoProps = {
  text?: string;
};

/**
 * Outrageous Trail of Cthulhu logo
 */
export const TrailLogo: React.FC<TrailLogoProps> = ({
  text = "TRAIL OF CTHULHU",
}) => {
  return (
    <div
      css={{
        display: "inline-block",
        perspective: "1000px",
        perspectivOrigin: "50% 50%",
      }}
    >
      <Global
        // see also
        // @import url('https://fonts.googleapis.com/css2?family=Arya:wght@400;700&display=swap');
        // @import url('https://fonts.googleapis.com/css2?family=Tenor+Sans&display=swap');
        styles={css`
        @import url('https://fonts.googleapis.com/css2?family=Federo&display=swap');
        `}
      />

      <span
        css={{
          position: "relative",
          display: "inline-block",
          fontFamily: "'Federo', sans-serif",
          textTransform: "uppercase",
          fontSize: "1.6em",
          letterSpacing: "-0.04em",
          transform:
            "scaleX(1.2) scaleY(1.6) rotateY(-30deg) rotateZ(-1deg) translateX(-2%)",
          border: "none",
          margin: "0.5em",
          padding: 0,
          lineHeight: 1,
          ":before": {
            position: "absolute",
            top: 0,
            left: 0,
            content: `'${text}'`,
            textShadow: "2px 0px 1px black, 6px 3px 4px rgba(0,0,0,0.5)",
            color: "transparent",
            zIndex: -1,
          },
          ":after": {
            position: "absolute",
            top: 0,
            left: 0,
            content: `'${text}'`,
            background: "linear-gradient(to bottom right, #000, #BE9F00)",
            backgroundClip: "text",
            color: "transparent",
          },
        }}
      >
        {text}
      </span>
    </div>
  );
};
