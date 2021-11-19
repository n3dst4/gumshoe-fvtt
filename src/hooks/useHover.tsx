import { useCallback, useState } from "react";

export const useHover = () => {
  const [hover, setHover] = useState(false);

  const onMouseEnter = useCallback((e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setHover(true);
  }, []);
  const onMouseLeave = useCallback((e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setHover(false);
  }, []);

  return { hover, onMouseEnter, onMouseLeave };
};
