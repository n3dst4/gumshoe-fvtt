export function getListTransitionStyles(
  isShowing: boolean,
  isEntering: boolean,
  transitionTime: number,
) {
  return {
    transition: `opacity ${transitionTime}ms ease-in-out, transform ${transitionTime}ms ease-in-out`,
    opacity: isShowing ? 1 : 0,
    transform: isShowing
      ? "none"
      : isEntering
      ? "translateX(-40px)"
      : "translateX(40px)",
  };
}
