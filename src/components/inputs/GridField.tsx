import React, { useMemo } from "react";
import { nanoid } from "nanoid";
import { IdContext } from "../IdContext";
import { Translate } from "../Translate";

type GridFieldProps = {
  label?: string;
  className?: string;
  children?: any;
  noLabel?: boolean;
  noTranslate?: boolean;
  labelTitle?: string;
};

export const GridField: React.FC<GridFieldProps> = ({
  label,
  className,
  children,
  noLabel = false,
  noTranslate = false,
  labelTitle,
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
      >
        {label &&
          (noTranslate || typeof label !== "string" ? (
            label
          ) : (
            <Translate title={labelTitle}>{label}</Translate>
          ))}
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
