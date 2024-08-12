import React, { useLayoutEffect } from "react";
import { flushSync } from "react-dom";

import { systemLogger } from "../../functions/utilities";

// adapted from https://github.com/mui/material-ui/blob/next/packages/mui-lab/src/Masonry/Masonry.js

export const parseToNumber = (val: string) => {
  return Number(val.replace("px", ""));
};

function isLinebreak(element: HTMLElement) {
  return element.dataset["class"] === "line-break";
}

function isValidElement(node: Node): node is HTMLElement {
  return node instanceof HTMLElement && !isLinebreak(node);
}

type MasonryProps = React.PropsWithChildren<{
  numColumns: number;
  columnGap?: string;
}>;

export const Masonry = function Masonry({
  children,
  numColumns,
  columnGap = "0px",
}: MasonryProps) {
  const masonryRef = React.useRef<HTMLDivElement>(null);
  const [maxColumnHeight, setMaxColumnHeight] = React.useState(0);

  // the base width of a column: 100% / the number of columns
  const baseColumnWidth = `${100 / numColumns}%`;

  // we adjust column width in a css calc based on the column gap * this factor
  // e.g. in a 3-column grid we subtract columnGap * ( 2/3 ) from the width
  // in a 4-column grid we subtract columnGap * ( 3/4 ) from the width
  // ... because there's no gap after the last column
  const columnGapSizingFactor = (numColumns - 1) / numColumns;

  const widthExpression = `calc(${baseColumnWidth} - (${columnGap} * ${columnGapSizingFactor}))`;

  // handle resize - the masonry engine
  const handleResize = React.useCallback(() => {
    systemLogger.log("handleResize");
    if (!masonryRef.current || masonryRef.current.clientWidth === 0) {
      return;
    }

    const columnHeights = new Array(numColumns).fill(0);

    const heights = Array.from(masonryRef.current.childNodes).map(
      (child: Node) => {
        if (isValidElement(child)) {
          return getComputedStyle(child).height;
        }
        return -1;
      },
    );

    systemLogger.log("heights", heights);

    // iterate through children
    masonryRef.current.childNodes.forEach((child: Node) => {
      // skip non-elements and linebreaks
      if (!isValidElement(child)) {
        return;
      }
      const computedStyle = getComputedStyle(child);
      const childHeight =
        Math.ceil(parseToNumber(computedStyle.height)) +
        parseToNumber(computedStyle.marginTop) +
        parseToNumber(computedStyle.marginBottom);

      // find the current shortest column (where the current item will be placed)
      const currentMinColumnIndex = columnHeights.indexOf(
        Math.min(...columnHeights),
      );
      columnHeights[currentMinColumnIndex] += childHeight;

      // update child styles
      child.style.order = `${currentMinColumnIndex + 1}`;
      child.style.marginRight =
        currentMinColumnIndex === numColumns - 1 ? "0px" : columnGap;
    });
    // wrap this in flushSync so the container get resized immediately - without
    // this there will be a flash of the wrong size
    flushSync(() => {
      setMaxColumnHeight(Math.max(...columnHeights));
    });
  }, [columnGap, numColumns]);

  useLayoutEffect(() => {
    // let animationFrame: number;

    const resizeObserver = new ResizeObserver((entries) => {
      systemLogger.log("resizeObserver", entries);
      // mui wraps this in a requestAnimationFrame
      // see https://github.com/mui/material-ui/issues/36909
      // animationFrame = requestAnimationFrame(handleResize);
      handleResize();
    });

    if (masonryRef.current) {
      masonryRef.current.childNodes.forEach((childNode: ChildNode) => {
        resizeObserver.observe(childNode as Element);
      });
    }

    return () => {
      // see above
      // if (animationFrame) {
      //   window.cancelAnimationFrame(animationFrame);
      // }
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [numColumns, children, handleResize]);

  const lineBreaks = new Array(numColumns - 1).fill("").map((_, index) => (
    <span
      key={index}
      data-class="line-break"
      style={{
        flexBasis: "100%",
        width: "0px",
        margin: "0px",
        padding: "0px",
        order: index + 1,
      }}
    />
  ));

  return (
    <div
      css={{
        display: "flex",
        flexFlow: "column wrap",
        width: "100%",
        height: maxColumnHeight === 0 ? "auto" : maxColumnHeight + "px",
        alignContent: "flex-start",
        "> *": {
          width: widthExpression,
        },
      }}
      ref={masonryRef}
    >
      {children}
      {lineBreaks}
    </div>
  );
};
