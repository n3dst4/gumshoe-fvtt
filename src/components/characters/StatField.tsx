import { Stat } from "@lumphammer/investigator-fvtt-types";
import { Fragment, useCallback } from "react";

import { useActorSheetContext } from "../../hooks/useSheetContexts";
import { assertActiveCharacterActor } from "../../v10Types";
import { AsyncNumberInput } from "../inputs/AsyncNumberInput";

interface StatFieldProps {
  stat: Stat;
  id: string;
}

export const StatField = ({ stat, id }: StatFieldProps) => {
  const { actor } = useActorSheetContext();
  assertActiveCharacterActor(actor);
  const onChange = useCallback(
    (newVal: number) => {
      assertActiveCharacterActor(actor);
      void actor.update({
        system: { stats: { ...actor.system.stats, [id]: newVal } },
      });
    },
    [actor, id],
  );

  return (
    <Fragment>
      <h3 css={{ gridColumn: "start / end" }}>{stat.name}</h3>
      <AsyncNumberInput
        min={stat.min ?? 0}
        max={stat.max}
        value={actor.system.stats[id] ?? stat.default}
        onChange={onChange}
      />
    </Fragment>
  );
};
