/** @jsx jsx */
import { jsx } from "@emotion/react";
import React from "react";
import { AsyncTextInput } from "./AsyncTextInput";

type FormFieldProps = {
  label: string,
  value: undefined|string,
  onChange: (newValue: string) => void,
  className?: string,
};

export const FormField: React.FC<FormFieldProps> = ({
  label,
  value,
  onChange,
  className,
}) => {
  return (
    <label
      css={{
        display: "flex",
        flexDirection: "row",
        marginBottom: "0.5em",
      }}
      className={className}
    >
    {label}
    <AsyncTextInput
      css={{
        flex: 1,
        marginLeft: "0.5em",
      }}
      value={value}
      onChange={onChange}
    />
  </label>);
};
