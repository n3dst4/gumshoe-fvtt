import { AnimatePresence, motion } from "framer-motion";
import React, { memo } from "react";

import { absoluteCover } from "../../components/absoluteCover";
import { easeInCubic, easeOutCubic } from "../animated/easings";
import { duration } from "../constants";
import { PropsWithChildrenAndDirection } from "../types";
import { useParamsSafe } from "../useParams";
import { useRoute } from "../useRoute";

export const SlideInRoute = memo<PropsWithChildrenAndDirection>(
  ({ children, direction }) => {
    const result = useRoute({ direction, children });
    const params = useParamsSafe(direction);
    return (
      <div
        css={{ ...absoluteCover, overflow: "hidden", pointerEvents: "none" }}
      >
        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              key={`direction.id ${params ? JSON.stringify(params) : ""}`}
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
