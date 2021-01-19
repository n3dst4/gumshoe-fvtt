/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { Fragment, useCallback } from "react";
import { nanoid } from "nanoid";

type CheckButtonsProps = {
  options: Array<{label: string, value: string}>,
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
        "input[type=radio]": {
          display: "none",
          "+label": {
            padding: "1em",
          },
          "&:checked+label": {
            background: "red", //
          },
        },
      }}
    >
      {
        options.map(({ label, value }) => {
          const id = nanoid();
          return (
            <Fragment key={value}>
              <input
                id={id}
                type="radio"
                value={value}
                checked={value === selected}
                onChange={onChange}
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
