/** @jsx jsx */
import { jsx } from "@emotion/react";
import React from "react";
import { equipment, generalSkill, investigativeSkill } from "../constants";
import { TrailItem } from "../module/TrailItem";
import { EquipmentSheet } from "./EquipmentSheet";
import { GeneralSkillSheet } from "./GeneralSkillSheet";
import { InvestigativeSkillSheet } from "./InvestigativeSkillSheet";

type TrailItemSheetProps = {
  entity: TrailItem,
  foundryWindow: Application,
};

export const TrailItemSheet: React.FC<TrailItemSheetProps> = ({
  entity,
  foundryWindow,
}) => {
  return (
    <div>
      {entity.type === investigativeSkill
        ? <InvestigativeSkillSheet entity={entity} foundryWindow={foundryWindow} />
        : entity.type === generalSkill
          ? <GeneralSkillSheet entity={entity} foundryWindow={foundryWindow} />
          : entity.type === equipment
            ? <EquipmentSheet entity={entity} foundryWindow={foundryWindow} />
            : <div>No sheet defined for item type &ldquo;{}&rdquo;</div>
      }
    </div>
  );
};
