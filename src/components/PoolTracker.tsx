import React, { useCallback, useMemo } from "react";
import { TrailActor } from "../module/TrailActor";
import { PoolCheckbox } from "./PoolCheckbox";

const range = (from: number, to: number): number[] => {
  if (to < from) {
    return range(to, from).reverse();
  }

  return new Array((to - from) + 1).fill(null).map((_, i) => from + i);
};

type PoolTrackerProps = {
  abilityName: string,
  actor: TrailActor,
  min: number,
  max: number,
};

export const PoolTracker: React.FC<PoolTrackerProps> = ({
  abilityName,
  actor,
  min,
  max,
}) => {
  const vals = range(min, max);

  const ability = useMemo(() => {
    return actor.items.find((item) => item.name === abilityName);
  }, [abilityName, actor.items]);

  const setPool = useCallback((pool: number) => {
    ability.update({
      data: {
        pool,
      },
    });
  }, [ability]);

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
        <PoolCheckbox
          key={v}
          value={v}
          onClick={setPool}
          selected={ability ? v === ability.data.data.pool : false}
          disabled={ability ? v > ability.data.data.rating : false}
        />
      ))}
    </div>
  );
};
