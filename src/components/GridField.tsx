/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import React, { Fragment } from "react";

type GridFieldProps = {
  label: string;
  className?: string;
  children: any;
};

export const GridField: React.FC<GridFieldProps> = ({
  label,
  className,
  children,
}) => {
  return (
    <Fragment>
      <div
        css={css`
          grid-column: label;
        `}
        className={className}
      >
        {label}
      </div>
      <div
        css={css`
          grid-column: control;
        `}
      >
        {children}
      </div>
    </Fragment>
  );
};
