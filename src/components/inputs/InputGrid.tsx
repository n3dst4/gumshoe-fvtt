/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import React from "react";
type InputGridProps = {
  children: any,
  className?: string,
};

export const InputGrid: React.FC<InputGridProps> = ({
  children,
  className,
}) => {
  return (
    <div
      css={css`
        display: grid;
        grid-template-rows: auto;
        grid-template-columns: [label] max-content [control] 1fr [end];
        grid-auto-rows: auto;
        column-gap: 0.5em;
        row-gap: 0.2em;
      `}
      className={className}
    >
      {children}
    </div>
  );
};
