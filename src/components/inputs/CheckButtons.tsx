/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { Fragment, useCallback } from "react";
import { nanoid } from "nanoid";

type CheckButtonsProps = {
  options: Array<{label: string, value: string, enabled: boolean}>,
  selected: string,
  onChange: (newValue: string) => void,
};

export const CheckButtons: React.FC<CheckButtonsProps> = ({
  options,
  selected,
  onChange: onChangeOrig,
}) => {
  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.currentTarget.value;
    onChangeOrig(newValue);
  }, [onChangeOrig]);

  return (
    <div
      css={{
        display: "flex",
        flexDirection: "row",
        gap: "0.3em",
        lineHeight: 1.4,
        "input[type=radio]": {
          display: "none",
          "+label": {
            padding: "0",
            flex: 1,
            textAlign: "center",
            fontSize: "1.4em",
            fontWeight: "bold",
            border: "2px groove white",
            backgroundColor: "rgba(0,0,0,0.1)",
            paddingBottom: "0.3em",
            borderRadius: "0.2em",
            ":hover": {
              textShadow: "0 0 0.3em rgba(255,111,18,1)",
            },
          },
          "&:checked+label": {
            background: "grey",
            border: "2px inset white",
            backgroundColor: "rgba(255,111,18,0.2)",
            ":hover": {
              textShadow: "none",
            },
          },
          "&[disabled]+label": {
            opacity: 0.3, //
            ":hover": {
              textShadow: "none",
            },
          },
        },
      }}
    >
      {
        options.map(({ label, value, enabled }) => {
          const id = nanoid();
          return (
            <Fragment key={value}>
              <input
                id={id}
                type="radio"
                value={value}
                checked={value === selected}
                onChange={onChange}
                disabled={!enabled}//
              />
              <label htmlFor={id}>
                {label}
              </label>
            </Fragment>
          );
        })
      }
    </div>
  );
};
