/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { Fragment } from "react";
import { InvestigatorActor } from "../../module/InvestigatorActor";
import { assertActiveCharacterDataSource } from "../../types";
import { Translate } from "../Translate";
import { getBuildPoints } from "./getBuildPoints";

type BuildPointAreaProps = {
  actor: InvestigatorActor,
};

export const BuildPointArea: React.FC<BuildPointAreaProps> = ({
  actor,
}) => {
  assertActiveCharacterDataSource(actor.data);

  const { generalBuildPoints, investigativeBuildPoints } = getBuildPoints(actor);

  return (
    <Fragment>
      <div
        css={{
          display: "grid",
          gridTemplateColumns: "1fr 10em 10em",
          columnGap: "1em",
          alignItems: "right",
        }}
      >
        <h4 css={{ gridColumn: 1 }} >
          <Translate>Build Points</Translate>:
        </h4>
        <div css={{ gridColumn: 2 }}>
          {investigativeBuildPoints} <Translate>Investigative</Translate>
        </div>
        <div css={{ gridColumn: 3 }}>
          {generalBuildPoints} <Translate>General</Translate>
        </div>
      </div>
      <h4> Free </h4>
    </Fragment>
  );
};
