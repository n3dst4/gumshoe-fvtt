import { Stat } from "@lumphammer/investigator-fvtt-types";
import React, { Fragment, useCallback } from "react";
import { assertActiveCharacterDataSource } from "../../typeAssertions";
import { AsyncNumberInput } from "../inputs/AsyncNumberInput";

interface StatFieldProps {
  stat: Stat;
  actor: Actor;
  id: string;
}

export const StatField: React.FC<StatFieldProps> = ({
  stat,
  actor,
  id,
}: StatFieldProps) => {
  assertActiveCharacterDataSource(actor.data);
  const onChange = useCallback((newVal: number) => {
    assertActiveCharacterDataSource(actor.data);
    actor.update({ data: { stats: { ...actor.data.data.stats, [id]: newVal } } });
  }, [actor, id]);

  return (
    <Fragment>
      <h3 css={{ gridColumn: "start / end" }}>
        {stat.name}
      </h3>
      <AsyncNumberInput
        min={stat.min ?? 0}
        max={stat.max}
        value={actor.data.data.stats[id] ?? stat.default}
        onChange={onChange}
      />
    </Fragment>
  );
};
