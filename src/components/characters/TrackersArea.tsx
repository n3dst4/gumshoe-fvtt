import { Fragment } from "react";

import { useActorSheetContext } from "../../hooks/useSheetContexts";
import { isGeneralAbilityItem } from "../../v10Types";
import { PoolTracker } from "../abilities/PoolTracker";

export const TrackersArea = () => {
  const { actor } = useActorSheetContext();
  const abilities = actor.getTrackerAbilities().toSorted((a, b) => {
    const aIsPushPool = isGeneralAbilityItem(a) && a.system.isPushPool;
    const bIsPushPool = isGeneralAbilityItem(b) && b.system.isPushPool;
    if (aIsPushPool && !bIsPushPool) {
      return -1;
    } else if (!aIsPushPool && bIsPushPool) {
      return 1;
    } else {
      return (a.name ?? "").localeCompare(b.name ?? "");
    }
  });

  return (
    <Fragment>
      {abilities.map<JSX.Element>((ability, i) => (
        <PoolTracker key={`${ability.name}-- ${i}`} ability={ability} />
      ))}
    </Fragment>
  );
};
