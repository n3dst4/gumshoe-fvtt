/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import React, { Fragment } from "react";

type GridFormFieldProps = {
  label: string,
  className?: string,
  children: any,
};

export const GridFormField: React.FC<GridFormFieldProps> = ({
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
  </Fragment>);
};
