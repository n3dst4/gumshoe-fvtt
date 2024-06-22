import React, { PropsWithChildren, useCallback } from "react";

import { AnyStep, DirectionType } from "../types";
import { useNavigationContext } from "../useNavigationContext";

interface LinkProps
  extends PropsWithChildren,
    React.RefAttributes<HTMLAnchorElement> {
  from?: DirectionType;
  to: AnyStep | AnyStep[] | "up";
}

/**
 * Create a link
 *
 * @param from The direction to link from. This can be a "here", "root", or a
 * Direction.
 * @param to The step or steps to link to, or "up" to go up a level.
 */
export const Link: React.FC<LinkProps> = ({
  children,
  from = "here",
  to,
  ...otherProps
}) => {
  const { navigate } = useNavigationContext();

  const onClick = useCallback<React.MouseEventHandler<HTMLAnchorElement>>(
    (e) => {
      e.preventDefault();
      navigate(from, to);
    },
    [from, navigate, to],
  );

  return (
    <a onClick={onClick} {...otherProps}>
      {children}
    </a>
  );
};
