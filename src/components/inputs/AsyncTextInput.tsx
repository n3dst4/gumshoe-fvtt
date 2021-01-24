/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useContext } from "react";
import { useAsyncUpdate } from "../../hooks/useAsyncUpdate";
import { IdContext } from "../IdContext";

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

  const id = useContext(IdContext);

  return (
    <input
      size={3}
      id={id}
      css={{
        flex: 1,
        width: "100%",
        minWidth: "8em",
      }}
      className={className}
      data-lpignore="true"
      value={display}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      disabled={disabled}
      placeholder={placeholder}
    />
  );
};
