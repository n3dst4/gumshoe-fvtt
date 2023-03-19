import { useEffect, useRef, useState } from "react";
import { useRefStash } from "../../hooks/useRefStash";

export enum TransitionState {
  startEntering,
  entering,
  entered,
  exiting,
  exited,
}

const mountedStates = [
  TransitionState.startEntering,
  TransitionState.entering,
  TransitionState.entered,
  TransitionState.exiting,
];

const showingStates = [TransitionState.entering, TransitionState.entered];

export function useShowHideTransition(show: boolean, duration: number) {
  const [transitionState, setTransitionState] = useState(
    show ? TransitionState.entering : TransitionState.exited,
  );

  const durationRef = useRefStash(duration);

  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    let timeoutId: ReturnType<typeof setTimeout>;

    if (show) {
      setTransitionState(TransitionState.startEntering);
      timeoutId = setTimeout(() => {
        setTransitionState(TransitionState.entering);
        timeoutId = setTimeout(() => {
          setTransitionState(TransitionState.entered);
        });
      });
    } else {
      setTransitionState(TransitionState.exiting);
      timeoutId = setTimeout(() => {
        setTransitionState(TransitionState.exited);
      }, durationRef.current);
    }

    timeoutRef.current = timeoutId;

    return () => {
      clearTimeout(timeoutId);
    };
  }, [durationRef, show]);

  return {
    transitionState,
    shouldMount: mountedStates.includes(transitionState),
    isShowing: showingStates.includes(transitionState),
  };
}
