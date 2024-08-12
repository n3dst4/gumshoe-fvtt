import React, { useLayoutEffect } from "react";
import { flushSync } from "react-dom";

// adapted from https://github.com/mui/material-ui/blob/next/packages/mui-lab/src/Masonry/Masonry.js

const columnMeasurerDataClass = "column-measurer";
const lineBreakDataClass = "line-break";

/**
 * Parse a string like "100px" to a number
 */
const parsePxToNumber = (pxString: string): number =>
  // no checking the source string here because we're only using this for
  // values that are coming from `getComputedStyle`
  Number(pxString.replace("px", ""));

/**
 * We only want to measure and position HTML elements that we didn't add
 * ourselves.
 */
const isValidElement = (node: Node): node is HTMLElement => {
  if (!(node instanceof HTMLElement)) {
    return false;
  }
  const dataClass = node.dataset["class"];
  return (
    dataClass !== columnMeasurerDataClass && dataClass !== lineBreakDataClass
  );
};

type MasonryProps = React.PropsWithChildren<{
  /**
   * The minimum width of a column. Any valid CSS length value. To achieve a
   * fixed column count, specify this as a percentage, e.g. 33.33% for three
   * columns.
   */
  minColumnWidth: string;
  /** The gap between columns. Any valid CSS length value. */
  columnGap?: string;
}>;

/**
 * A simple masonry layout component. It will layout children in columns,
 * starting from the top left and adding children to the shortest column.
 *
 * Uses flexbox with wrapping and a fixed height to flow the layout.
 */
export const Masonry = function Masonry({
  children,
  minColumnWidth,
  columnGap = "0px",
}: MasonryProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const measurerRef = React.useRef<HTMLDivElement>(null);
  const [maxColumnHeight, setMaxColumnHeight] = React.useState(0);
  const [numColumns, setNumColumns] = React.useState(1);

  // compare the measurer to the container to work out how many columns we can
  // fit in.
  const handleCalculateNumColumns = React.useCallback(() => {
    if (!measurerRef.current || !containerRef.current) {
      return;
    }
    const outerWidth = containerRef.current.clientWidth;
    const innerWidth = measurerRef.current.clientWidth;
    const numColumns = Math.max(1, Math.floor(outerWidth / innerWidth));
    setNumColumns(numColumns);
  }, []);

  // run handleCalculateNumColumns when the container or the measurer changes
  useLayoutEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      handleCalculateNumColumns();
    });
    resizeObserver.observe(containerRef.current!);
    resizeObserver.observe(measurerRef.current!);
    return () => {
      resizeObserver.disconnect();
    };
  }, [handleCalculateNumColumns]);

  // the base width of a column: 100% / the number of columns
  const baseColumnWidth = numColumns === 0 ? "100%" : `${100 / numColumns}%`;

  // we adjust column width in a css calc based on the column gap * this factor
  // e.g. in a 3-column grid we subtract columnGap * ( 2/3 ) from the width
  // in a 4-column grid we subtract columnGap * ( 3/4 ) from the width
  // ... because there's no gap after the last column
  const columnGapSizingFactor =
    numColumns === 0 ? 0 : (numColumns - 1) / numColumns;

  const widthExpression = `calc(${baseColumnWidth} - (${columnGap} * ${columnGapSizingFactor}))`;

  // handle resize - the core of the masonry engine
  const handleResize = React.useCallback(() => {
    if (
      !containerRef.current ||
      containerRef.current.clientWidth === 0 ||
      numColumns === 0
    ) {
      return;
    }

    const columnHeights = new Array(numColumns).fill(0);

    // iterate through children
    containerRef.current.childNodes.forEach((child: Node) => {
      // skip non-elements and linebreaks
      if (!isValidElement(child)) {
        return;
      }
      const computedStyle = getComputedStyle(child);
      const childHeight =
        Math.ceil(parsePxToNumber(computedStyle.height)) +
        parsePxToNumber(computedStyle.marginTop) +
        parsePxToNumber(computedStyle.marginBottom);

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
      // mui wraps this in a requestAnimationFrame
      // see https://github.com/mui/material-ui/issues/36909
      // animationFrame = requestAnimationFrame(handleResize);
      handleResize();
    });

    if (containerRef.current) {
      containerRef.current.childNodes.forEach((childNode: ChildNode) => {
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
    // depends on children even though they're not mentioned by name
  }, [handleResize, children]);

  // linebreaks force the flex-wrap to move everything after into a new column
  const lineBreaks = new Array(numColumns - 1).fill("").map((_, index) => (
    <span
      key={index}
      data-class={lineBreakDataClass}
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
        position: "relative",
        "> *": {
          width: widthExpression,
        },
      }}
      ref={containerRef}
    >
      <div
        data-class={columnMeasurerDataClass}
        ref={measurerRef}
        // using style not css to ensure we override the parent styles
        style={{
          width: minColumnWidth,
          visibility: "hidden",
          position: "absolute",
        }}
      />
      {children}
      {lineBreaks}
    </div>
  );
};
