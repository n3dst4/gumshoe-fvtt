import React, { forwardRef, useContext } from "react";
import { TransitionProgressContext } from "./TransitionInOut";

interface DropdownBodyProps {
  children: React.ReactNode;
  top: number;
  right: number;
}

/**
 * A container for the dropdown body, which is rendered outside the main DOM
 */
export const DropdownBody = forwardRef<HTMLDivElement, DropdownBodyProps>(
  ({ children, top, right }, ref) => {
    const opacity = useContext(TransitionProgressContext);
    return (
      <div
        className="dropdown-outer"
        ref={ref}
        style={{
          opacity,
          zIndex: 10000,
          position: "absolute",
          boxSizing: "border-box",
          top,
          right,
        }}
      >
        {children}
      </div>
    );
  },
);

DropdownBody.displayName = "DropdownBody";
