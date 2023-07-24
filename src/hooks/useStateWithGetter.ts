import { useCallback, useState } from "react";

import { useRefStash } from "./useRefStash";

/**
 * Like useState, but returns a third item, a getter. This is a shortcut for the
 * practice of stuffing state into a ref so you can get it back later in a
 * callback without regenerating the callback every time the value changes.
 *
 * This is actually an encapsulation of a practice suggested by the Hooks FAQ
 * itself https://reactjs.org/docs/hooks-faq.html#how-to-read-an-often-changing-value-from-usecallback
 *
 * They actually recommend using `dispatch` instead of passing callbacks around.
 */
export function useStateWithGetter<T>(initial: T) {
  const [value, setValue] = useState(initial);
  const ref = useRefStash(value);
  const getValue = useCallback(
    function () {
      return ref.current;
    },
    [ref],
  );
  return [getValue, setValue, value] as const; // as const makes it a tuple
}
