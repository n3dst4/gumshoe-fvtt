import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import throttle from "lodash/throttle";

/**
 * Hook for handling async updates, e,g, where you want to be calling an
 * external onChange every so often but you can't be relying on it updating
 * fast enough to handle your react state.
 */
export const useAsyncUpdate = (value: string, onChange: (newValue: string) => void) => {
  // many shenanigans to handle slow updates
  // first up, state to handle the actual text we show so we can update it in a
  // timely fashion
  const [display, setDisplay] = useState(value || "");
  // state to track focus
  const focusedRef = useRef(false);

  // callback for focus
  const onFocus = useCallback(() => {
    focusedRef.current = true;
  }, []);

  // callback for blur
  const onBlur = useCallback(() => {
    focusedRef.current = false;
  }, []);

  const onChangeDebounced = useMemo(() => {
    return throttle(onChange, 500);
  }, [onChange]);

  const onChangeCb = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplay(e.currentTarget.value);
    onChangeDebounced(e.currentTarget.value);
  }, [onChangeDebounced]);

  const onInputCb = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    const text = e.currentTarget.innerText;
    setDisplay(text);
    onChangeDebounced(text);
  }, [onChangeDebounced]);

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

  return {
    onChangeCb,
    onInputCb,
    onFocus,
    onBlur,
    display,
  };
};
