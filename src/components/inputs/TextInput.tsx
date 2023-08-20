import React, { ChangeEvent, useCallback, useContext } from "react";

import { IdContext } from "../IdContext";

type TextInputProps = {
  className?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  disabled?: boolean;
  placeholder?: string;
  style?: React.CSSProperties;
};

export const TextInput: React.FC<TextInputProps> = ({
  className,
  value,
  defaultValue,
  onChange,
  onFocus,
  onBlur,
  disabled,
  placeholder,
  style,
}) => {
  const id = useContext(IdContext);

  const onChangeCb = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.currentTarget.value);
    },
    [onChange],
  );

  return (
    <input
      role="text-input"
      size={3}
      id={id}
      css={{
        flex: 1,
        width: "100%",
        "::placeholder": {
          opacity: 0.5,
          fontStyle: "italic",
        },
      }}
      style={style}
      className={className}
      data-lpignore="true"
      value={value}
      defaultValue={defaultValue}
      onChange={onChangeCb}
      onFocus={onFocus}
      onBlur={onBlur}
      disabled={disabled}
      placeholder={placeholder}
    />
  );
};
