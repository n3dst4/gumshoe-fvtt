import { easeSinOut } from "d3-ease";
import React, {
  createContext,
  useCallback,
  useEffect,
  useTransition,
} from "react";

export const TransitionProgressContext = createContext(0);

interface TransitionInOutProps {
  children: React.ReactNode;
  fadeTime?: number;
  fps?: number;
}

/**
 * Transition children in and out, like a TransitionGroup.
 *
 * The transition is provided as a context value, so that the children can do
 * whatever they like with it. The value is a number between 0 and 1, where 0
 * means the children are invisible, and 1 means they are fully visible.
 *
 * This is curently not used, use useShowHideTransition instead.
 */
export const TransitionInOut = ({
  children,
  fadeTime = 300,
  fps = 30,
}: TransitionInOutProps) => {
  const [progress, setProgress] = React.useState(0);
  const startTransition = useTransition()[1];
  const hasChildren = !!children && React.Children.count(children) > 0;
  const [lastChildren, setLastChildren] = React.useState(children);

  // track the last "positive" children, so that we can fade them out
  useEffect(() => {
    if (hasChildren) {
      setLastChildren(children);
    }
  }, [children, hasChildren]);

  // animation tick function for the next useEffect
  const doTick = useCallback(
    (interval: NodeJS.Timeout, startAt: number, hasChildren: boolean) => {
      const elapsed = Date.now() - startAt;
      const progress = elapsed / fadeTime;
      const easedProgress = easeSinOut(progress);
      const adaptedEasedProgress = hasChildren
        ? easedProgress
        : 1 - easedProgress;

      if (elapsed > fadeTime) {
        // end of transition
        clearInterval(interval);
        if (hasChildren) {
          setProgress(1);
        } else {
          setProgress(0);
          setLastChildren(null);
        }
      } else {
        startTransition(() => {
          setProgress(adaptedEasedProgress);
        });
      }
    },
    [fadeTime, startTransition],
  );

  // effect triggers when hasChildren changes (the other dependencies are
  // stable.)
  useEffect(() => {
    const startAt = Date.now();
    const interval: NodeJS.Timeout = setInterval(
      () => doTick(interval, startAt, hasChildren),
      1000 / fps,
    );
    return () => {
      clearInterval(interval);
    };
  }, [doTick, fadeTime, fps, hasChildren, setProgress, startTransition]);

  return (
    <TransitionProgressContext.Provider value={progress}>
      {lastChildren}
    </TransitionProgressContext.Provider>
  );
};

TransitionInOut.displayName = "FadeInOut";
