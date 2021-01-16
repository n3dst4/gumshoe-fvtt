/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useCallback, useEffect, useState } from "react";

type FormFieldProps = {
  label: string,
  value: string,
  onChange: (newValue: string) => void,
};

export const FormField: React.FC<FormFieldProps> = ({
  label,
  value,
  onChange,
}) => {
  const [display, setDisplay] = useState(value);
  const [focused, setFocused] = useState(false);

  const onFocus = useCallback(() => {
    setFocused(true);
  }, []);

  const onBlur = useCallback(() => {
    setFocused(false);
    onChange(display);
  }, [display, onChange]);

  useEffect(() => {
    if (!focused) {
      setDisplay(value);
    }
  }, [focused, value]);

  return (
    <label
      css={{
        display: "flex",
        flexDirection: "row",
      }}
    >
    {label}
    <input
      css={{
        flex: 1,
      }}
      value={display}
      onChange={(e) => setDisplay(e.currentTarget.value)}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  </label>);
};
