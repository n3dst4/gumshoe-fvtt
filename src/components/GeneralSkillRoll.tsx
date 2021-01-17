/** @jsx jsx */
import { jsx } from "@emotion/react";
import React from "react";
import { TrailItem } from "../module/TrailItem";
import { CSSReset } from "./CSSReset";
type GeneralSkillRollProps = {
  entity: TrailItem,
  foundryWindow: Application,
};

export const GeneralSkillRoll: React.FC<GeneralSkillRollProps> = ({
  entity,
  foundryWindow,
}) => {
  return (
    <CSSReset>
      <h1>
        General skill roll
      </h1>
        {entity.name}
    </CSSReset>
  );
};
