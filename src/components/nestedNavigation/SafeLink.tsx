import React, { ComponentPropsWithRef } from "react";
import { Link as RouterLink } from "react-router-dom";

export function SafeLink(props: ComponentPropsWithRef<typeof RouterLink>) {
  const title =
    typeof props.to === "string" ? props.to : props.to.pathname ?? "";

  return (
    <RouterLink {...props} onClick={(e) => e.stopPropagation()} title={title} />
  );
}
