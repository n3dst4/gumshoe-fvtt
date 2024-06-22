import { AnimatePresence, motion } from "framer-motion";
import React, { memo, PropsWithChildren } from "react";

import { absoluteCover } from "../../components/absoluteCover";
import { duration } from "../constants";
import { useOutletProvider } from "../outlets/useOutletProvider";
import { easeInCubic, easeOutCubic } from "./easings";

export const SlideInOutlet = memo<PropsWithChildren>(({ children }) => {
  const { content, registry } = useOutletProvider(children);
  return (
    <div
      css={{
        ...absoluteCover,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <AnimatePresence mode="wait">
        {Object.entries(registry)
          .filter(([_, content]) => content !== null)

          .map(([id, content]) => (
            <motion.div
              key={id}
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
              {content}
            </motion.div>
          ))}
      </AnimatePresence>

      {content}
    </div>
  );
});

SlideInOutlet.displayName = "SlideinOutlet";
