import React, {
  createContext,
  useCallback,
  useEffect,
  useTransition,
} from "react";
import { easeSinOut } from "d3-ease";

export const OpacityContext = createContext(0);

interface FadeInOutProps {
  children: React.ReactNode;
  fadeTime?: number;
  fps?: number;
}

/**
 * Fade children in and out, like a TransitionGroup.
 *
 * This is a basic proof of concept, but could be generalised to allow different
 * enter/exit animations.
 */
export const FadeInOut: React.FC<FadeInOutProps> = ({
  children,
  fadeTime = 300,
  fps = 30,
}) => {
  const [opacity, setOpacity] = React.useState(0);
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

      console.log("doTick", {
        elapsed,
        progress,
        easedProgress,
        adaptedEasedProgress,
      });
      if (elapsed > fadeTime) {
        console.log("end of transition");
        // end of transition
        clearInterval(interval);
        if (!hasChildren) {
          console.log("removing lastChildren");
          setLastChildren(null);
        }
      } else {
        startTransition(() => {
          console.log("setting opacity to", adaptedEasedProgress);
          setOpacity(adaptedEasedProgress);
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
  }, [doTick, fadeTime, fps, hasChildren, setOpacity, startTransition]);

  return (
    <OpacityContext.Provider value={opacity}>
      {lastChildren}
    </OpacityContext.Provider>
  );
};

FadeInOut.displayName = "FadeInOut";
