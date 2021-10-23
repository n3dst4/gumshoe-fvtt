/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { Fragment } from "react";
import { InvestigatorActor } from "../../module/InvestigatorActor";
import { PoolTracker } from "../abilities/PoolTracker";

type TrackersAreaProps = {
  actor: InvestigatorActor,
};

export const TrackersArea: React.FC<TrackersAreaProps> = ({
  actor,
}) => {
  const abs = actor.getTrackerAbilities();

  return (
    <Fragment>
      {
        abs.map<JSX.Element>((ability, i) => (
          <PoolTracker key={`${ability.name}-- ${i}`} ability={ability} />
        ))
      }
    </Fragment>
  );
};
