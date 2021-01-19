/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useCallback } from "react";

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
      }}
    >
      {
        options.map(({ label, value }) => {
          return (
            <label
              key={value}
            >
              <input
                type="radio"
                value={value}
                checked={value === selected}
                onChange={onChange}
              />
              {label}
            </label>
          );
        })
      }
    </div>
  );
};
