/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import throttle from "lodash/throttle";

type AsyncTextInputProps = {
  value: undefined|string,
  onChange: (newValue: string) => void,
  className?: string,
};

export const AsyncTextInput: React.FC<AsyncTextInputProps> = ({
  value,
  onChange,
  className,
}) => {
  // many shenanigans to handle slow updates
  // first up, state to handle the actual text we show so we can update it in a
  // timely fashion
  const [display, setDisplay] = useState(value || "");
  // state to track focus
  const [focused, setFocused] = useState(false);
  // and a ref which will copy the `focused` state - see later
  const focusedRef = useRef(focused);

  // callback for focus
  const onFocus = useCallback(() => {
    setFocused(true);
  }, []);

  // callback for blur
  const onBlur = useCallback(() => {
    setFocused(false);
    onChange(display);
  }, [display, onChange]);

  const onChangeDebounced = useMemo(() => {
    console.log("memo");
    return throttle(onChange, 1000, {
    });
  }, [onChange]);

  const onChangeCb = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplay(e.currentTarget.value);
    onChangeDebounced(e.currentTarget.value);
  }, [onChangeDebounced]);

  // we're going to track the focused state in a ref so we can get the most
  // recent value in another effect, without it having to depend directly on
  // `focused`.
  useEffect(() => {
    focusedRef.current = focused;
  }, [focused]);

  // update the display text when the value changes, but only if we're not
  // focused. why do we use a ref for focused instead of depending directly on
  // focused? it's because otherwise we get a flash of wrongness on blur,
  // because this effect fires in response to `focused` but `value` hasn't
  // changed yet. This way we only fire on `value` changing, and check the focus
  // state indirectly via the ref.
  useEffect(() => {
    if (!focusedRef.current) {
      setDisplay(value);
    }
  }, [value]);

  return (
    <input
      css={css`
        flex: 1;
        margin-left: 0.5em;
        width: 100%;
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
