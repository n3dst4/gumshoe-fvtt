/** @jsx jsx */
import { jsx } from "@emotion/react";
import React from "react";
import { equipment, weapon } from "../constants";
import { TrailItem } from "../module/TrailItem";
import { EquipmentSheet } from "./equipment/EquipmentSheet";
import { AbilitySheet } from "./abilities/AbilitySheet";
import { isAbility } from "../functions";
import { WeaponSheet } from "./equipment/WeaponSheet";
import { CSSReset } from "./CSSReset";

type TrailItemSheetProps = {
  item: TrailItem,
  foundryWindow: Application,
};

/**
 * We only register one "Item" sheet with foundry and then dispatch based on
 * type here.
 */
export const TrailItemSheet: React.FC<TrailItemSheetProps> = ({
  item,
  foundryWindow,
}) => {
  const theme = item.getTheme();

  return (
    <CSSReset theme={theme}>
      {isAbility(item)
        ? <AbilitySheet ability={item} foundryWindow={foundryWindow} />
        : item.type === equipment
          ? <EquipmentSheet entity={item} foundryWindow={foundryWindow} />
          : item.type === weapon
            ? <WeaponSheet weapon={item} foundryWindow={foundryWindow} />
            : <div>No sheet defined for item type &ldquo;{}&rdquo;</div>
      }
    </CSSReset>
  );
};
