import React from "react";

import { absoluteCover } from "../absoluteCover";
import { useElementSize } from "./useElementSize";

export type RenderComponentProps<TData> = {
  index: number;
  data: TData;
  width: number;
};

interface MasonryProps<TData> {
  data: TData[];
  render: (props: RenderComponentProps<TData>) => React.ReactNode;
}

export const createMasonry = <TData,>() => {
  const Masonry = React.memo<MasonryProps<TData>>(function Masonry({
    data,
    render,
  }) {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [width] = useElementSize(containerRef);
    const children = data.map((datum, index) => {
      return (
        <div className="masonry-item-wrapper" key={index}>
          {render({ index, data: datum, width })}
        </div>
      );
    });
    return (
      <div className="masonry" css={{}} ref={containerRef}>
        {children}
      </div>
    );
  });
  Masonry.displayName = "Masonry";
  return Masonry;
};
