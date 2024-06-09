import { AnimatePresence, motion } from "framer-motion";
import React, { memo } from "react";
import { useOutlet } from "react-router-dom";

import { absoluteCover } from "../absoluteCover";
import { duration } from "./constants";
import { useFamilyPaths } from "./useFamilyPaths";

// https://easings.net
function easeInQuart(x: number): number {
  return x * x * x * x;
}
function easeOutQuart(x: number): number {
  return 1 - Math.pow(1 - x, 4);
}

interface SlideInOutletProps {
  routeId: string;
}

export const SlideInOutlet = memo(({ routeId }: SlideInOutletProps) => {
  const { childPath } = useFamilyPaths(routeId);
  const outlet = useOutlet();

  return (
    <AnimatePresence>
      {outlet && childPath && (
        <div
          key={childPath}
          css={{ ...absoluteCover, overflow: "hidden", pointerEvents: "none" }}
        >
          <motion.div
            css={{
              ...absoluteCover,
              width: "100%",
              pointerEvents: "none",
            }}
            initial={{
              x: "100%",
            }}
            animate={{
              x: 0,
              transition: { duration, ease: easeOutQuart },
            }}
            exit={{
              x: "100%",
              transition: { duration, ease: easeInQuart },
            }}
          >
            <div css={{ pointerEvents: "all" }}>{outlet}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});

SlideInOutlet.displayName = "SlideInOutlet";
