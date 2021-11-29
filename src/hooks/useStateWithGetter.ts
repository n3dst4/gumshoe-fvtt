import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Like useState, but returns a third item, a getter. This is a shortcut for the
 * practice of stuffing state into a ref so you can get it back later in a
 * callback without regenerating the callback every time the value changes.
 *
 * Honestly not sure if this is a good idea. Seems too obvious< like, why isn't
 * this standard?
 */
export function useStateWithGetter<T> (initial: T) {
  const [value, setValue] = useState(initial);
  const ref = useRef(initial);
  useEffect(function () {
    ref.current = value;
  }, [value]);
  const getValue = useCallback(function () {
    return ref.current;
  }, []);
  return [value, setValue, getValue] as const; // as const makes it a tuple
}
