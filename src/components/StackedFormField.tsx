/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import React, { Fragment } from "react";

type StackedFormFieldProps = {
  label: string;
  className?: string;
  children: any;
};

export const StackedFormField: React.FC<StackedFormFieldProps> = ({
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
