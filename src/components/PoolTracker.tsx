import React from "react";
import { PoolCheckbox } from "./PoolCheckbox";

const range = (from: number, to: number): number[] => {
  if (to < from) {
    return range(to, from).reverse();
  }

  return new Array((to - from) + 1).fill(null).map((_, i) => from + i);
};

type PoolTrackerProps = {
  value: number,
  min: number,
  max: number,
};

export const PoolTracker: React.FC<PoolTrackerProps> = ({
  value,
  min,
  max,
}) => {
  const vals = range(min, max);
  return (
    <div
      style={{
        width: "8em",
        height: "auto",
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr 1fr",
        // gridAutoRows: "2em",
      }}
    >
      {vals.map((v) => (
        <PoolCheckbox key={v} value={v} selected={v === value} />
      ))}
    </div>
  );
};
