/** @jsx jsx */
import { jsx } from "@emotion/react";
import React from "react";
import { TrailActor } from "../module/TrailActor";
import { GridField } from "./inputs/GridField";
import { InputGrid } from "./inputs/InputGrid";

type SettingAreaProps = {
  actor: TrailActor,
};

export const SettingArea: React.FC<SettingAreaProps> = ({
  actor,
}) => {
  return (
    <InputGrid>
        <GridField label="Nuke">
          <button onClick={actor.confirmNuke}>
            Nuke
          </button>
        </GridField>
    </InputGrid>
  );
};
