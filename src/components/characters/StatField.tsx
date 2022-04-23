/** @jsx jsx */
import { jsx } from "@emotion/react";
import { Stat } from "@lumphammer/investigator-fvtt-types";
import React, { Fragment, useCallback } from "react";
import { assertPCDataSource } from "../../types";
import { AsyncNumberInput } from "../inputs/AsyncNumberInput";

interface StatFieldProps {
  stat: Stat;
  actor: Actor;
  key: string;
}

export const StatField: React.FC<StatFieldProps> = ({
  stat,
  actor,
  key,
}: StatFieldProps) => {
  assertPCDataSource(actor.data);
  const onChange = useCallback((newVal: number) => {
    assertPCDataSource(actor.data);
    actor.update({ data: { stats: { ...actor.data.data.stats, [key]: newVal } } });
  }, [actor, key]);

  return (
    <Fragment>
    <h3 css={{ gridColumn: "start / end" }}>
      {stat.name}
    </h3>
    <AsyncNumberInput
      min={stat.min ?? 0}
      max={stat.max}
      value={actor.data.data.stats[key] ?? stat.default}
      onChange={onChange}
    />
  </Fragment>
  );
};
