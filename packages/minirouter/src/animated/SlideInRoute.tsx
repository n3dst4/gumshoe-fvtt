import { CSSObject } from "@emotion/react";
import { AnimatePresence, motion } from "framer-motion";
import React, { memo } from "react";

import { PropsWithChildrenAndDirection } from "../types";
import { useNavigationContext } from "../useNavigationContext";
import { useRoute } from "../useRoute";
import { duration } from "./constants";
import { easeInCubic, easeOutCubic } from "./easings";

const absoluteCover: CSSObject = {
  position: "absolute",
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

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
