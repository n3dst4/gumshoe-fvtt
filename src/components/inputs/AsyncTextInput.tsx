/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import React from "react";
import { useAsyncUpdate } from "../../hooks/useAsyncUpdate";

type AsyncTextInputProps = {
  value: undefined|string,
  onChange: (newValue: string) => void,
  className?: string,
  disabled?: boolean,
};

export const AsyncTextInput: React.FC<AsyncTextInputProps> = ({
  value,
  onChange: onChangeOrig,
  className,
  disabled,
}) => {
  const {
    onChange,
    onFocus,
    onBlur,
    display,
  } = useAsyncUpdate(value, onChangeOrig);

  return (
    <input
      css={css`
        flex: 1;
        /* margin-left: 0.5em; */
        width: 100%;
      `}
      className={className}
      data-lpignore="true"
      value={display}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      disabled={disabled}
    />
  );
};
