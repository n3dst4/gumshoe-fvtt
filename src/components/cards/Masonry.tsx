import React, { ReactNode, useLayoutEffect, useState } from "react";

import { useElementSize } from "./useElementSize";

export type RenderComponentProps<TData> = {
  index: number;
  data: TData;
  width: number;
};

interface MasonryProps<TData> {
  data: TData[];
  render: (props: RenderComponentProps<TData>) => React.ReactNode;
  minColumnWidth?: number;
}

export const createMasonry = <TData,>() => {
  const Masonry = React.memo<MasonryProps<TData>>(function Masonry({
    data,
    render,
    minColumnWidth = 170,
  }) {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [width] = useElementSize(containerRef);
    const [dataHeights, setDataHeights] = useState(
      new Array(data.length).fill(0),
    );

    useLayoutEffect(() => {
      if (!containerRef.current) {
        return;
      }
      console.log("layout effect");
      const wrappers = containerRef.current.querySelectorAll(
        ".masonry-item-wrapper",
      );
      if (wrappers.length !== data.length) {
        return;
      }
      const heights = Array.from(wrappers).map(
        (wrapper) => wrapper.getBoundingClientRect().height,
      );
      setDataHeights(heights);
    }, [data.length]);

    const columnCount = 1;
    const columnHeights = new Array<number>(columnCount).fill(0);
    let children: ReactNode = null;

    if (containerRef.current) {
      const columnCount = Math.max(Math.floor(width / minColumnWidth), 1);
      const columnWidth = width / columnCount;

      const columnarData = new Array<Array<number>>(columnCount)
        .fill([])
        .map((): number[] => []);

      data.forEach((datum, index) => {
        const height = dataHeights[index];
        const shortestColumnIndex = columnHeights.indexOf(
          Math.min(...columnHeights),
        );
        columnHeights[shortestColumnIndex] += height;
        columnarData[shortestColumnIndex].push(index);
      });

      children = columnarData.map((indicesinColumn, columnIndex) =>
        indicesinColumn.map((indexInData, indexInColumn) => {
          return (
            <div
              key={indexInData}
              className="masonry-item-wrapper"
              css={{
                position: "absolute",
                width: columnWidth,
                top: indicesinColumn
                  .slice(0, indexInColumn)
                  .reduce((sum, index) => sum + dataHeights[index], 0),
                left: columnIndex * columnWidth,
              }}
            >
              {render({
                index: indexInData,
                data: data[indexInData],
                width: columnWidth,
              })}
            </div>
          );
        }),
      );
    }

    return (
      <div
        className="masonry"
        css={{
          width: "100%",
          height: Math.max(...columnHeights) + 200 + "px",
          overflow: "hidden",
          position: "relative",
        }}
        ref={containerRef}
      >
        {children}
      </div>
    );
  });
  Masonry.displayName = "Masonry";
  return Masonry;
};
