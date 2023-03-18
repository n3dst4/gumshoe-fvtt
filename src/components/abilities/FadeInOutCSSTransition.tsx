import { css } from "@emotion/css";
import React from "react";
import { CSSTransition } from "react-transition-group";
import { CSSTransitionClassNames } from "react-transition-group/CSSTransition";

export const opacityDuration = 400;
const opacityTransition = `opacity ${opacityDuration}ms`;

export const fadeInOutClasses: CSSTransitionClassNames = {
  enter: css({
    opacity: 0,
  }),
  enterActive: css({
    opacity: 1,
    maxHeight: "100%",
    transition: `${opacityTransition} ease-in`,
  }),
  exit: css({
    opacity: 1,
  }),
  exitActive: css({
    opacity: 0,
    transition: `${opacityTransition} ease-out`,
  }),
};

interface FadeInOutCSSTransitionProps {
  children: React.ReactNode;
  nodeRef: React.RefObject<HTMLDivElement>;
}

export const FadeInOutCSSTransition = React.memo<FadeInOutCSSTransitionProps>(
  (props) => {
    return (
      <CSSTransition {...props} timeout={500} classNames={fadeInOutClasses} />
    );
  },
);

FadeInOutCSSTransition.displayName = "FadeInOutCSSTransition";
