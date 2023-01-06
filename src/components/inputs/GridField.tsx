import React, { useMemo } from "react";
import { nanoid } from "nanoid";
import { IdContext } from "../IdContext";
import { Translate } from "../Translate";

type GridFieldProps = {
  label?: string,
  className?: string,
  children?: any,
  noLabel?: boolean,
  noTranslate?: boolean,
  labelTitle?: string,
  onClickLabel?: () => unknown,
};

export const GridField: React.FC<GridFieldProps> = ({
  label,
  className,
  children,
  noLabel = false,
  noTranslate = false,
  labelTitle,
  onClickLabel,
}) => {
  const id = useMemo(() => nanoid(), []);
  return (
    <IdContext.Provider value={id}>
      <label
        title={labelTitle}
        htmlFor={noLabel ? undefined : id}
        css={{
          gridColumn: "label",
          paddingTop: "0.3em",
          paddingRight: "0.5em",
        }}
        className={className}
        onClick={(e) => {
          e.stopPropagation();
          onClickLabel?.();
        }}
      >
        {label && ((noTranslate || typeof label !== "string") ? label : <Translate title={labelTitle}>{label}</Translate>)}
      </label>
      <div
        className={className}
        css={{
          gridColumn: "control",
        }}
      >
        {children}
      </div>
    </IdContext.Provider>
  );
};
