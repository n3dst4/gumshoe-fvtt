import React, { ReactNode, useLayoutEffect } from "react";

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

    useLayoutEffect(() => {
      //
    }, []);

    const columnCount = 1;
    const columnHeights = new Array<number>(columnCount).fill(0);
    const dataHeights = new Array(data.length).fill(0);
    let children: ReactNode = null;

    if (containerRef.current) {
      const columnCount = Math.max(Math.floor(width / minColumnWidth), 1);
      const columnWidth = width / columnCount;

      const columnarData = new Array<Array<number>>(columnCount).fill([]);

      data.forEach((datum, index) => {
        const height = dataHeights[index];
        const shortestColumnIndex = columnHeights.indexOf(
          Math.min(...columnHeights),
        );
        console.log(shortestColumnIndex, columnHeights[shortestColumnIndex]);
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
