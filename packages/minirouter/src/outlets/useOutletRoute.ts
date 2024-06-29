import { ReactNode, useContext, useEffect, useId } from "react";

import { OutletContext } from "./OutletContext";

export const useOutletRoute = (content: ReactNode) => {
  const id = useId();
  const outletContext = useContext(OutletContext);
  useEffect(() => {
    if (outletContext) {
      outletContext.register(id, content);
      return () => {
        outletContext.unregister(id);
      };
    }
  }, [content, id, outletContext]);
  return outletContext ? null : content;
};
