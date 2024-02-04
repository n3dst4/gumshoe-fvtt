import { ReactNode, useContext, useEffect, useId, useMemo } from "react";

import { MagicToolbarRegisterContext } from "./contexts";
import { MagicToolbarContentEntry } from "./types";

/**
 * Register content with the magic toolbar. HIGHLY recommended to use `useMemo`
 * inside the call to this hook to stabilise the content.
 */
export function useToolbarContent(content: ReactNode, sort: number = 0) {
  // const content = useMemo(contentFn, []);

  const id = useId();

  const { register, unregister } = useContext(MagicToolbarRegisterContext);

  const contentObject = useMemo<MagicToolbarContentEntry>(
    () => ({ sort, content }),
    [content, sort],
  );

  useEffect(() => {
    register(id, contentObject);
    return () => {
      unregister(id);
    };
  }, [content, contentObject, id, register, unregister]);
}
