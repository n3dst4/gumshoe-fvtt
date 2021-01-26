/** @jsx jsx */
import { jsx } from "@emotion/react";
import React from "react";
import { useAsyncUpdate } from "../../hooks/useAsyncUpdate";
import { TextInput } from "./TextInput";

type AsyncTextInputProps = {
  value: undefined|string,
  onChange: (newValue: string) => void,
  className?: string,
  disabled?: boolean,
  placeholder?: string,
};

export const AsyncTextInput: React.FC<AsyncTextInputProps> = ({
  value,
  onChange: onChangeOrig,
  className,
  disabled,
  placeholder,
}) => {
  const {
    onChange,
    onFocus,
    onBlur,
    display,
  } = useAsyncUpdate(value, onChangeOrig);

  return (
    <TextInput
      className={className}
      value={display}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      disabled={disabled}
      placeholder={placeholder}
    />
  );
};
