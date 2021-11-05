/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import { nanoid } from "nanoid";
import React, { useMemo } from "react";
import { IdContext } from "../IdContext";
import { Translate } from "../Translate";

type GridFieldStackedProps = {
  label?: string,
  className?: string,
  children: any,
  noTranslate?: boolean,
};

export const GridFieldStacked: React.FC<GridFieldStackedProps> = ({
  label,
  className,
  children,
  noTranslate,
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
        {label && (noTranslate ? label : <Translate>{label}</Translate>)}
        {children}
      </div>
    </IdContext.Provider>
  );
};
