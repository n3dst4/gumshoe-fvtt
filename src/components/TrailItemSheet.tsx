/** @jsx jsx */
import { jsx } from "@emotion/react";
import React from "react";
import { equipment, weapon } from "../constants";
import { TrailItem } from "../module/TrailItem";
import { EquipmentSheet } from "./equipment/EquipmentSheet";
import { AbilitySheet } from "./abilities/AbilitySheet";
import { isAbility } from "../functions";
import { WeaponSheet } from "./equipment/WeaponSheet";

type TrailItemSheetProps = {
  entity: TrailItem,
  foundryWindow: Application,
};

/**
 * We only register one "Item" sheet with foundry and then dispatch based on
 * type here.
 */
export const TrailItemSheet: React.FC<TrailItemSheetProps> = ({
  entity,
  foundryWindow,
}) => {
  return (
    <div>
      {isAbility(entity)
        ? <AbilitySheet ability={entity} foundryWindow={foundryWindow} />
        : entity.type === equipment
          ? <EquipmentSheet entity={entity} foundryWindow={foundryWindow} />
          : entity.type === weapon
            ? <WeaponSheet entity={entity} foundryWindow={foundryWindow} />
            : <div>No sheet defined for item type &ldquo;{}&rdquo;</div>
      }
    </div>
  );
};
