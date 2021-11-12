/** @jsx jsx */
import { CSSObject, jsx } from "@emotion/react";
import React from "react";
import { equipment, mwItem, weapon } from "../constants";
import { InvestigatorItem } from "../module/InvestigatorItem";
import { EquipmentSheet } from "./equipment/EquipmentSheet";
import { AbilitySheet } from "./abilities/AbilitySheet";
import { isAbility } from "../functions";
import { WeaponSheet } from "./equipment/WeaponSheet";
import { CSSReset, CSSResetMode } from "./CSSReset";
import { ItemSheetAppContext } from "./FoundryAppContext";
import { isAbilityDataSource, isMwItemDataSource } from "../types";
import { WmItemSheet } from "./equipment/WmItemSheet";

type InvestigatorItemSheetProps = {
  item: InvestigatorItem,
  foundryApplication: ItemSheet,
};

/**
 * We only register one "Item" sheet with foundry and then dispatch based on
 * type here.
 */
export const InvestigatorItemSheet: React.FC<InvestigatorItemSheetProps> = ({
  item,
  foundryApplication,
}) => {
  const theme = item.getTheme();

  const style: CSSObject = isAbilityDataSource(item.data) || isMwItemDataSource(item.data)
    ? {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }
    : {
        position: "relative",
      };

  return (
    <ItemSheetAppContext.Provider value={foundryApplication}>
      <CSSReset
        theme={theme}
        mode={CSSResetMode.small}
        css={style}
      >
        {isAbility(item)
          ? <AbilitySheet ability={item} application={foundryApplication} />
          : item.type === equipment
            ? <EquipmentSheet equipment={item} application={foundryApplication} />
            : item.type === weapon
              ? <WeaponSheet weapon={item} application={foundryApplication} />
              : item.type === mwItem
                ? <WmItemSheet item={item} application={foundryApplication} />
                : <div>No sheet defined for item type &ldquo;{}&rdquo;</div>
        }
      </CSSReset>
    </ItemSheetAppContext.Provider>
  );
};
