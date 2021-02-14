/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { ChangeEvent, useCallback, useContext } from "react";
import { IdContext } from "../IdContext";

type TextAreaProps = {
  className?: string,
  value?: string,
  defaultValue?: string,
  onChange?: (value: string) => void,
  onFocus?: () => void,
  onBlur?: () => void,
  disabled?: boolean,
  placeholder?: string,

};

export const TextArea: React.FC<TextAreaProps> = ({
  className,
  value,
  defaultValue,
  onChange,
  onFocus,
  onBlur,
  disabled,
  placeholder,
}) => {
  const id = useContext(IdContext);

  const onChangeCb = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(e.currentTarget.value);
  }, [onChange]);

  return (
    <textarea
      id={id}
      css={{
        flex: 1,
        width: "100%",
      }}
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
