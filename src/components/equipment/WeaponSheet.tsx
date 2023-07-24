import React from "react";

import { InvestigatorItem } from "../../module/InvestigatorItem";
import { ModeSelect } from "../ItemSheetFramework/ModeSelect";
import { ItemSheetFramework } from "../ItemSheetFramework/SheetFramework";
import { ItemSheetMode } from "../ItemSheetFramework/types";
import { Translate } from "../Translate";
import { WeaponAttack } from "./WeaponAttack";
import { WeaponConfig } from "./WeaponConfig";

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
