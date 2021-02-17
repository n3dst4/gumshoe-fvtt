/* eslint-disable react-hooks/exhaustive-deps */
/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { ChangeEvent, useCallback, useContext } from "react";
import { useAsyncUpdate } from "../../hooks/useAsyncUpdate";
import { IdContext } from "../IdContext";

type AsyncTextAreaProps = {
  className?: string,
  value: string,
  onChange: (value: string, index?: number) => void,
  disabled?: boolean,
  index?: number,
};

export const AsyncTextArea: React.FC<AsyncTextAreaProps> = ({
  className,
  value,
  onChange: onChangeOrig,
  disabled,
  index,
}) => {
  const id = useContext(IdContext);

  const {
    onChange,
    onFocus,
    onBlur,
    display,
  } = useAsyncUpdate(value, onChangeOrig, index);

  const onChangeCb = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.currentTarget.value);
  }, [index, onChange]);

  return (
    <textarea
      id={id}
      css={{
        flex: 1,
        width: "100%",
      }}
      className={className}
      data-lpignore="true"
      value={display || ""}
      onChange={onChangeCb}
      onFocus={onFocus}
      onBlur={onBlur}
      disabled={disabled}
    />
  );
};
