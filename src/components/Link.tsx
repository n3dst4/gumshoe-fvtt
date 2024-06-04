import { Link as RouterLink } from "@tanstack/react-router";
import React, { ComponentPropsWithRef } from "react";

function stopPropagation(e: React.MouseEvent<"a", MouseEvent>) {
  e.stopPropagation();
}

/**
 * Custom version of Link component that stops propagation so
 * that whatever weird link handler Foundry has doesn't get triggered.
 */
export function Link(props: ComponentPropsWithRef<typeof RouterLink>) {
  return <RouterLink {...props} onClick={stopPropagation} />;
}
