/** @jsx jsx */
import { jsx } from "@emotion/react";
import React from "react";
import { equipment, generalAbility, investigativeAbility } from "../constants";
import { TrailItem } from "../module/TrailItem";
import { EquipmentSheet } from "./EquipmentSheet";
import { AbilitySheet } from "./abilities/AbilitySheet";
import { InvestigativeAbilitySheet } from "./abilities/InvestigativeAbilitySheet";

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
      {entity.type === investigativeAbility
        ? <InvestigativeAbilitySheet entity={entity} foundryWindow={foundryWindow} />
        : entity.type === generalAbility
          ? <AbilitySheet ability={entity} foundryWindow={foundryWindow} />
          : entity.type === equipment
            ? <EquipmentSheet entity={entity} foundryWindow={foundryWindow} />
            : <div>No sheet defined for item type &ldquo;{}&rdquo;</div>
      }
    </div>
  );
};
