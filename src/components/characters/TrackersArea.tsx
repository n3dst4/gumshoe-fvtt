/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { Fragment } from "react";
import { TrailActor } from "../../module/TrailActor";
import { PoolTracker } from "../abilities/PoolTracker";

type TrackersAreaProps = {
  actor: TrailActor,
};

export const TrackersArea: React.FC<TrackersAreaProps> = ({
  actor,
}) => {
  const abs = actor.getTrackerAbilities();

  return (
    <Fragment>
      {
        abs.map((ability, i) => (
          <PoolTracker key={`${ability.name}-- ${i}`} ability={ability} />
        ))
      }
    </Fragment>
  );
};
