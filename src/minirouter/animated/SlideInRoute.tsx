import { AnimatePresence, motion } from "framer-motion";
import React, { memo } from "react";

import { absoluteCover } from "../../components/absoluteCover";
import { PropsWithChildrenAndDirection } from "../types";
import { useNavigationContext } from "../useNavigationContext";
import { useRoute } from "../useRoute";
import { duration } from "./constants";
import { easeInCubic, easeOutCubic } from "./easings";

export const SlideInRoute = memo<PropsWithChildrenAndDirection>(
  ({ children, direction }) => {
    const result = useRoute({ direction, children });
    const { currentStep } = useNavigationContext();
    return (
      <div
        css={{ ...absoluteCover, overflow: "hidden", pointerEvents: "none" }}
      >
        <AnimatePresence mode="wait">
          {result && currentStep && (
            <motion.div
              key={currentStep.id}
              css={{
                ...absoluteCover,
                width: "100%",
                zIndex: 2,
              }}
              initial={{
                x: "100%",
              }}
              animate={{
                x: 0,
                transition: { duration, ease: easeOutCubic },
              }}
              exit={{
                x: "100%",
                zIndex: 1,
                transition: { duration, ease: easeInCubic },
              }}
            >
              {result}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  },
);

SlideInRoute.displayName = "SlideInRoute";
