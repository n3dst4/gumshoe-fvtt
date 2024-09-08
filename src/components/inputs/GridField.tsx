import { nanoid } from "nanoid";
import React, { DragEventHandler, useMemo } from "react";

import { IdContext } from "../IdContext";
import { Translate } from "../Translate";

type GridFieldProps = {
  label?: string;
  className?: string;
  children?: any;
  noLabel?: boolean;
  noTranslate?: boolean;
  labelTitle?: string;
  onDragOver?: DragEventHandler<HTMLElement>;
  onDragEnd?: DragEventHandler<HTMLElement>;
  onDrop?: DragEventHandler<HTMLElement>;
};

export const GridField: React.FC<GridFieldProps> = ({
  label,
  className,
  children,
  noLabel = false,
  noTranslate = false,
  labelTitle,
  onDragOver,
  onDragEnd,
  onDrop,
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
          alignSelf: "center",
          overflowWrap: "anywhere",
        }}
        // drag handlers
        onDragOver={onDragOver}
        onDragLeave={onDragEnd}
        onDragEnd={onDragEnd}
        onDrop={onDrop}
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
          alignSelf: "center",
        }}
        // drag handlers
        onDragOver={onDragOver}
        onDragLeave={onDragEnd}
        onDragEnd={onDragEnd}
        onDrop={onDrop}
      >
        {children}
      </div>
    </IdContext.Provider>
  );
};
