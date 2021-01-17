/** @jsx jsx */
import { jsx } from "@emotion/react";
import React from "react";
import { TrailItem } from "../module/TrailItem";
type InvestigativeSkillSheetProps = {
  entity: TrailItem,
  foundryWindow: Application,
};

export const InvestigativeSkillSheet: React.FC<InvestigativeSkillSheetProps> = ({
  entity,
  foundryWindow,
}) => {
  return (
    <div>investigative skill</div>
  );
};
