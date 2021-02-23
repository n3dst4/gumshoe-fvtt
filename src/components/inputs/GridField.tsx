/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import React, { useMemo } from "react";
import { nanoid } from "nanoid";
import { IdContext } from "../IdContext";

type GridFieldProps = {
  label?: string;
  className?: string;
  children?: any;
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
        css={{
          gridColumn: "label",
          paddingTop: "0.3em",
        }}
        className={className}
      >
        {label}
      </label>
      <div
        className={className}
        css={css`
          grid-column: control;
        `}
      >
        {children}
      </div>
    </IdContext.Provider>
  );
};
