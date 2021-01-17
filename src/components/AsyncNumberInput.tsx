/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import React, { useCallback, useEffect, useRef, useState } from "react";

type AsyncNumberInputProps = {
  value: undefined|number,
  onChange: (newValue: number) => void,
  className?: string,
};

export const AsyncNumberInput: React.FC<AsyncNumberInputProps> = ({
  value,
  onChange,
  className,
}) => {
  // many shenanigans to handle slow updates
  // first up, state to handle the actual text we show so we can update it in a
  // timely fashion
  const [display, setDisplay] = useState(value === undefined ? "0" : value.toString());
  // state to track focus
  const [focused, setFocused] = useState(false);
  // and a ref which will copy the `focused` state - see later
  const focusedRef = useRef(focused);
  // track error state
  const [error, setError] = useState(false);

  // callback for focus
  const onFocus = useCallback(() => {
    setFocused(true);
  }, []);

  // we're going to track the focused state in a ref so we can get the most
  // recent value in another effect, without it having to depend directly on
  // `focused`.
  useEffect(() => {
    focusedRef.current = focused;
  }, [focused]);

  // callback for blur
  const onBlur = useCallback(() => {
    setFocused(false);
    const numberValue = Number(display);
    if (Number.isNaN(numberValue)) {
      setError(true);
    } else {
      onChange(numberValue);
    }
  }, [display, onChange]);

  const onChangeCb = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setError(false);
    setDisplay(e.currentTarget.value);
  }, []);

  // update the display text when the value changes, but only if we're not
  // focused. why do we use a ref for focused instead of depending directly on
  // focused? it's because otherwise we get a flash of wrongness on blur,
  // because this effect fires in response to `focused` but `value` hasn't
  // changed yet. This way we only fire on `value` changing, and check the focus
  // state indirectly via the ref.
  useEffect(() => {
    if (!focusedRef.current) {
      setDisplay(value === undefined ? "0" : value.toString());
    }
  }, [value]);

  return (
    <input
      css={css`
        flex: 1;
        margin-left: 0.5em;
        width: 100%;
        color: ${error ? "red" : undefined};
        user-select: "text";
      `}
      className={className}
      data-lpignore="true"
      value={display}
      onChange={onChangeCb}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  );
};
