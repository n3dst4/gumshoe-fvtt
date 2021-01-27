/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import React, { useMemo } from "react";
import { nanoid } from "nanoid";
import { IdContext } from "../IdContext";

type GridFieldProps = {
  label?: string;
  className?: string;
  children: JSX.Element;
};

export const GridField: React.FC<GridFieldProps> = ({
  label,
  className,
  children,
}) => {
  const id = useMemo(() => nanoid(), []);
  return (
    <IdContext.Provider value={id}>
      <label
        htmlFor={id}
        css={css`
          grid-column: label;
        `}
        className={className}
      >
        {label}
      </label>
      <div
        css={css`
          grid-column: control;
        `}
      >
        {children}
      </div>
    </IdContext.Provider>
  );
};
