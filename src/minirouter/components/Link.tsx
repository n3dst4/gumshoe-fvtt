import React, { forwardRef, PropsWithChildren, useCallback } from "react";

import { Direction } from "../createDirection";
import { AnyStep, DirectionType } from "../types";
import { useNavigationContext } from "../useNavigationContext";

type LinkProps = React.RefAttributes<HTMLAnchorElement> &
  PropsWithChildren<{
    from?: DirectionType;
    to: AnyStep | AnyStep[] | "up";
  }>;

// thanks to TS 5.5 this is a type guard even without the `: x is y` syntax
function isDirection(x: DirectionType) {
  return x instanceof Direction;
}

/**
 * Create a link
 *
 * @param from The direction to link from. This can be a "here", "root", or a
 * Direction.
 * @param to The step or steps to link to, or "up" to go up a level.
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ children, from = "here", to, ...otherProps }, ref) => {
    const { navigate, parentSteps, currentStep } = useNavigationContext();
    if (isDirection(from)) {
      if (
        currentStep?.direction.id !== from.id &&
        !parentSteps.some((s) => s.direction.id === from.id)
      ) {
        throw new Error(
          `Link has "from" set to ${from.id} but the current step is not a descendant of that step`,
        );
      }
    }

    const onClick = useCallback<React.MouseEventHandler<HTMLAnchorElement>>(
      (e) => {
        e.preventDefault();
        navigate(from, to);
      },
      [from, navigate, to],
    );

    return (
      <a onClick={onClick} ref={ref} {...otherProps}>
        {children}
      </a>
    );
  },
);

Link.displayName = "Link";
