/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import { nanoid } from "nanoid";
import React, { useMemo } from "react";
import { IdContext } from "../IdContext";

type GridFieldStackedProps = {
  label?: string,
  className?: string,
  children: any,
};

export const GridFieldStacked: React.FC<GridFieldStackedProps> = ({
  label,
  className,
  children,
}) => {
  const htmlId = useMemo(() => nanoid(), []);
  return (
    <IdContext.Provider value={htmlId}>
      <div
        css={css`
          grid-column: label / end;
        `}
        className={className}
      >
        <label htmlFor={htmlId}>{label}</label>
        {children}
      </div>
    </IdContext.Provider>
  );
};
