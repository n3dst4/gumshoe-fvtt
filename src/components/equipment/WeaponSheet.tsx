import React from "react";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { WeaponConfig } from "./WeaponConfig";
import { WeaponAttack } from "./WeaponAttack";
import { Translate } from "../Translate";
import { ItemSheetFramework } from "../ItemSheetFramework/SheetFramework";
import { ModeSelect } from "../ItemSheetFramework/ModeSelect";
import { ItemSheetMode } from "../ItemSheetFramework/types";

type WeaponSheetProps = {
  weapon: InvestigatorItem;
  application: ItemSheet;
};

export const WeaponSheet: React.FC<WeaponSheetProps> = ({
  weapon,
  application,
}) => {
  return (
    <ItemSheetFramework
      supertitle={<Translate>Weapon</Translate>}
      item={weapon}
      application={application}
    >
      <ModeSelect mode={ItemSheetMode.Main}>
        <WeaponAttack weapon={weapon} />
      </ModeSelect>
      <ModeSelect mode={ItemSheetMode.Config}>
        <WeaponConfig weapon={weapon} />
      </ModeSelect>
    </ItemSheetFramework>
  );
};
