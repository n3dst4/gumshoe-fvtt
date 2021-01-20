/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import React, { Fragment } from "react";

type GridFieldStackedProps = {
  label?: string;
  className?: string;
  children: any;
};

export const GridFieldStacked: React.FC<GridFieldStackedProps> = ({
  label,
  className,
  children,
}) => {
  return (
    <Fragment>
      <div
        css={css`
          grid-column: label / end;
        `}
        className={className}
      >
        {label}
        {children}
      </div>
    </Fragment>
  );
};
