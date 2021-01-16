/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useCallback, useEffect, useRef, useState } from "react";

type FormFieldProps = {
  label: string,
  value: undefined|string,
  onChange: (newValue: string) => void,
};

export const FormField: React.FC<FormFieldProps> = ({
  label,
  value,
  onChange,
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
