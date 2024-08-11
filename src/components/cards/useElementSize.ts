import { useEffect, useMemo, useState } from "react";

export const useElementSize = <T extends HTMLElement = HTMLElement>(
  ref: React.MutableRefObject<T | null>,
): [number, number] => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const resizeObsever = useMemo(
    () =>
      new ResizeObserver((entries) => {
        const entry = entries[0];
        // XXX width/heigh vs block/inline - this may be wrong
        setWidth(entry.contentBoxSize[0].inlineSize);
        setHeight(entry.contentBoxSize[0].blockSize);
      }),
    [],
  );

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    resizeObsever.observe(ref.current);
    return () => {
      resizeObsever.disconnect();
    };
  }, [ref, resizeObsever]);

  return [width, height];
};
