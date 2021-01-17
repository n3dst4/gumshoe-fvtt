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
        grid-template-columns: [label] min-content [control] 1fr;
        grid-auto-rows: auto;
      `}
      className={className}
    >
      {children}
    </div>
  );
};
