/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useContext } from "react";
import { IdContext } from "../IdContext";

type CheckboxProps = {
  checked: boolean,
  onChange: (checked: boolean) => void,
};

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
}) => {
  const id = useContext(IdContext);

  return (
    <input
      id={id}
      type="checkbox"
      checked={checked}
      css={{
        lineHeight: "inherit",
        height: "inherit",
        background: "red",
        "&[type=checkbox]": {
          height: "inherit",
        },
      }}
      onChange={(e) => {
        onChange(e.currentTarget.checked);
      }}
    />
  );
};
