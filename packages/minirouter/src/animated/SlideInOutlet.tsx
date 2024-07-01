import { AnimatePresence, motion } from "framer-motion";
import React, { memo, PropsWithChildren } from "react";

import { absoluteCover } from "../../../../src/components/absoluteCover";
import { useOutletProvider } from "../outlets/useOutletProvider";
import { duration } from "./constants";
import { easeInCubic, easeOutCubic } from "./easings";

type SlideInOutletProps = PropsWithChildren<{
  /**
   * If true, the content will be rendered after the routed content.
   */
  after?: boolean;
}>;

export const SlideInOutlet = memo<SlideInOutletProps>(
  ({ children, after = false }) => {
    const { content, registry } = useOutletProvider(children);
    const wrappedContent = (
      <div css={{ ...absoluteCover, pointerEvents: "none" }}>{content}</div>
    );

    return (
      <div
        css={{
          ...absoluteCover,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        {after && wrappedContent}

        <AnimatePresence mode="wait">
          {Object.entries(registry)
            .filter(([_, routedContent]) => routedContent !== null)
            .map(([id, content]) => (
              <motion.div
                key={id}
                className={`slide-in-outlet-slider-${id}`}
                css={{
                  ...absoluteCover,
                  width: "100%",
                  zIndex: 2,
                  pointerEvents: "none",
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

        {after || wrappedContent}
      </div>
    );
  },
);

SlideInOutlet.displayName = "SlideinOutlet";
