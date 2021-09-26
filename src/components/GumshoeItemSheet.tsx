/** @jsx jsx */
import { jsx } from "@emotion/react";
import React from "react";
import { equipment, weapon } from "../constants";
import { GumshoeItem } from "../module/GumshoeItem";
import { EquipmentSheet } from "./equipment/EquipmentSheet";
import { AbilitySheet } from "./abilities/AbilitySheet";
import { isAbility } from "../functions";
import { WeaponSheet } from "./equipment/WeaponSheet";
import { CSSReset } from "./CSSReset";
import { ItemSheetAppContext } from "./FoundryAppContext";

type GumshoeItemSheetProps = {
  item: GumshoeItem,
  foundryApplication: ItemSheet,
};

/**
 * We only register one "Item" sheet with foundry and then dispatch based on
 * type here.
 */
export const GumshoeItemSheet: React.FC<GumshoeItemSheetProps> = ({
  item,
  foundryApplication,
}) => {
  const theme = item.getTheme();

  return (
    <ItemSheetAppContext.Provider value={foundryApplication}>
      <CSSReset
        theme={theme}
        shroudBackground
        css={{
          position: "relative",
          ":before": {
            content: '" "',
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          },
        }}
      >
        <div css={{ position: "relative" }}>
          {isAbility(item)
            ? <AbilitySheet ability={item} application={foundryApplication} />
            : item.type === equipment
              ? <EquipmentSheet equipment={item} application={foundryApplication} />
              : item.type === weapon
                ? <WeaponSheet weapon={item} application={foundryApplication} />
                : <div>No sheet defined for item type &ldquo;{}&rdquo;</div>
          }
        </div>
      </CSSReset>
    </ItemSheetAppContext.Provider>
  );
};
