import React, { useLayoutEffect } from "react";

import { systemLogger } from "../../functions/utilities";

// adapted from https://github.com/mui/material-ui/blob/next/packages/mui-lab/src/Masonry/Masonry.js

export const parseToNumber = (val: string) => {
  return Number(val.replace("px", ""));
};

function isHTMLElement(node: Node): node is HTMLElement {
  return node instanceof HTMLElement;
}

function isLinebreak(element: HTMLElement) {
  return element.dataset["class"] === "line-break";
}

function isValidElement(node: Node): node is HTMLElement {
  return isHTMLElement(node) && !isLinebreak(node);
}

type MasonryProps = React.PropsWithChildren<{
  numColumns: number;
}>;

export const Masonry = function Masonry({
  children,
  numColumns,
}: MasonryProps) {
  const masonryRef = React.useRef<HTMLDivElement>(null);
  const [maxColumnHeight, setMaxColumnHeight] = React.useState(0);

  // handle resize - the masonry engine
  const handleResize = React.useCallback(() => {
    systemLogger.log("handleResize");
    if (!masonryRef.current || masonryRef.current.clientWidth === 0) {
      return;
    }

    const columnHeights = new Array(numColumns).fill(0);

    // iterate through children
    masonryRef.current.childNodes.forEach((child: Node) => {
      // skip non-elements and linebreaks
      if (!isValidElement(child)) {
        return;
      }
      const computedStyle = window.getComputedStyle(child);
      const childHeight =
        Math.ceil(parseToNumber(computedStyle.height)) +
        parseToNumber(computedStyle.marginTop) +
        parseToNumber(computedStyle.marginBottom);

      // find the current shortest column (where the current item will be placed)
      const currentMinColumnIndex = columnHeights.indexOf(
        Math.min(...columnHeights),
      );
      columnHeights[currentMinColumnIndex] += childHeight;
      const order = currentMinColumnIndex + 1;
      child.style.order = `${order}`;
    });
    setMaxColumnHeight(Math.max(...columnHeights));
  }, [numColumns]);

  useLayoutEffect(() => {
    // IE and old browsers are not supported
    if (typeof ResizeObserver === "undefined") {
      return undefined;
    }

    let animationFrame: number;

    const resizeObserver = new ResizeObserver(() => {
      // see https://github.com/mui/material-ui/issues/36909
      animationFrame = requestAnimationFrame(handleResize);
    });

    if (masonryRef.current) {
      masonryRef.current.childNodes.forEach((childNode: ChildNode) => {
        resizeObserver.observe(childNode as Element);
      });
    }

    return () => {
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
      }
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
        height: maxColumnHeight,
        alignContent: "flex-start",
        "> *": {
          width: `${100 / numColumns}%`,
        },
      }}
      ref={masonryRef}
    >
      {children}
      {lineBreaks}
    </div>
  );
};
