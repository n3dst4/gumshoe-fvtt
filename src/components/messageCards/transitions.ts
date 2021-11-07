import { css } from "@emotion/css";
import { CSSTransitionClassNames } from "react-transition-group/CSSTransition";

const maxHeight = "3em";
export const duration = 200;
const maxHeightTransition = `max-height ${duration}ms ease-out`;

export const termsClasses: CSSTransitionClassNames = {
  enter: css({
    maxHeight: 0,
  }),
  enterActive: css({
    maxHeight,
    transition: maxHeightTransition,
    overflow: "hidden",
  }),
  exit: css({
    maxHeight,
  }),
  exitActive: css({
    maxHeight: 0,
    transition: maxHeightTransition,
    overflow: "hidden",
  }),
};

export const opacityDuration = 400;
const opacityTransition = `opacity ${opacityDuration}ms linear`;

export const fadeInOutClasses: CSSTransitionClassNames = {
  enter: css({
    opacity: 0,
  }),
  enterActive: css({
    opacity: 1,
    maxHeight,
    transition: `${opacityTransition} 400ms`,
  }),
  exit: css({
    opacity: 1,
  }),
  exitActive: css({
    opacity: 0,
    transition: opacityTransition,
  }),
};
