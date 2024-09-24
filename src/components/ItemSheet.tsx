import { CSSObject } from "@emotion/react";
import React from "react";

import { useTheme } from "../hooks/useTheme";
import { InvestigatorItem } from "../module/InvestigatorItem";
import {
  isAbilityItem,
  isCardItem,
  isEquipmentItem,
  isMwItem,
  isPersonalDetailItem,
  isWeaponItem,
} from "../v10Types";
import { AbilitySheet } from "./abilities/AbilitySheet";
import { CardSheet } from "./cards/CardSheet";
import { CSSReset } from "./CSSReset";
import { EquipmentSheet } from "./equipment/EquipmentSheet";
import { MwItemSheet } from "./equipment/MwItemSheet";
import { WeaponSheet } from "./equipment/WeaponSheet";
import { NotesTypeContext } from "./NotesTypeContext";
import { PersonalDetailSheet } from "./personalDetails/PersonalDetailSheet";
import { ThrowError } from "./ThrowError";

type ItemSheetProps = {
  item: InvestigatorItem;
  application: ItemSheet;
};

/**
 * We only register one "Item" sheet with foundry and then dispatch based on
 * type here.
 */
export const ItemSheet = (
  {
    item,
    application
  }: ItemSheetProps
) => {
  const themeName = item.getThemeName();
  const theme = useTheme(themeName);

  const style: CSSObject =
    isAbilityItem(item) || isMwItem(item)
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
    <CSSReset theme={theme} mode="small" css={style}>
      <NotesTypeContext.Provider value="itemNote">
        {isAbilityItem(item) ? (
          <AbilitySheet ability={item} application={application} />
        ) : isEquipmentItem(item) ? (
          <EquipmentSheet equipment={item} application={application} />
        ) : isWeaponItem(item) ? (
          <WeaponSheet weapon={item} application={application} />
        ) : isMwItem(item) ? (
          <MwItemSheet item={item} application={application} />
        ) : isPersonalDetailItem(item) ? (
          <PersonalDetailSheet
            personalDetail={item}
            application={application}
          />
        ) : isCardItem(item) ? (
          <CardSheet card={item} application={application} />
        ) : (
          <ThrowError message={`No sheet defined for item type ${item.type}`} />
        )}
      </NotesTypeContext.Provider>
    </CSSReset>
  );
};
