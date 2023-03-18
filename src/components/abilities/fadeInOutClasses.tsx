import { css } from "@emotion/css";
import { CSSTransitionClassNames } from "react-transition-group/CSSTransition";

export const opacityDuration = 300;
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
