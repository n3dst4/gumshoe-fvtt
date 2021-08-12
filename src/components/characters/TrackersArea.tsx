/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { Fragment } from "react";
import { GumshoeActor } from "../../module/GumshoeActor";
import { PoolTracker } from "../abilities/PoolTracker";

type TrackersAreaProps = {
  actor: GumshoeActor,
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
