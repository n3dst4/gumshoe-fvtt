import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import throttle from "lodash/throttle";

/**
 * Hook for handling async updates, e,g, where you want to be calling an
 * external onChange every so often but you can't be relying on it updating
 * fast enough to handle your react state.
 */
export const useAsyncUpdate = (
  value: string,
  onChangeOrig: (newValue: string) => void,
) => {
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

  // we only fire the update event every so often to avoid spamming the
  // network
  const onChangeThrottled = useMemo(() => {
    return throttle(onChangeOrig, 500);
  }, [onChangeOrig]);

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplay(e.currentTarget.value);
    onChangeThrottled(e.currentTarget.value);
  }, [onChangeThrottled]);

  // for posterity, i'm leaving this here - a mechanism to relay the text
  // through a secondary div to avoid having the text affected by
  // text-transform: uppercase on the element. We've fixed that differently by
  // using font-variant: small-caps but it might be handy in future.

  // const repeaterDivRef = useRef<HTMLDivElement|null>(null);
  // useEffect(() => {
  //   repeaterDivRef.current = document.createElement("div");
  //   document.body.appendChild(repeaterDivRef.current);
  // }, []);

  // stuff for handling content-editable - first, a ref to attach to the element
  const contentEditableRef = useRef<HTMLDivElement|null>(null);

  // a callback for whe edits happen
  const onInput = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    // if (repeaterDivRef.current === null) {
    //   return;
    // }
    // repeaterDivRef.current.innerHTML = e.currentTarget.innerHTML;
    const text = e.currentTarget.innerText;
    setDisplay(text);
    onChangeThrottled(text);
  }, [onChangeThrottled]);

  // update the display text when the value changes, but only if we're not
  // focused.
  useEffect(() => {
    if (!focusedRef.current) {
      setDisplay(value);
      if (contentEditableRef.current) {
        contentEditableRef.current.innerText = value;
      }
    }
  }, [value]);

  return {
    onChange,
    onInput,
    onFocus,
    onBlur,
    display,
    contentEditableRef,
  };
};
