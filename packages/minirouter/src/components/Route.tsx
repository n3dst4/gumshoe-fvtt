import React from "react";

import { PropsWithChildrenAndDirection } from "../types";
import { useRoute } from "../useRoute";

/**
 *
 */
export const Route: React.FC<PropsWithChildrenAndDirection> = ({
  direction,
  children,
}) => {
  const result = useRoute({ direction, children });
  return result;
};
