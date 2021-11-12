/** @jsx jsx */
import { jsx } from "@emotion/react";
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
        css={{
          gridColumn: "label / end",
          position: "relative",
          display: "flex",
          flexDirection: "column",
        }}
        className={className}
      >
        <label
          htmlFor={htmlId}
          css={{
          }}
        >
          {label && (noTranslate ? label : <Translate>{label}</Translate>)}
        </label>
        <div
          css={{
            position: "relative",
            flex: 1,
          }}
        >
          {children}
        </div>
      </div>
    </IdContext.Provider>
  );
};
