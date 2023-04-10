import React from "react";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { useAsyncUpdate } from "../../hooks/useAsyncUpdate";
import { Translate } from "../Translate";
import { EquipmentMain } from "./EquipmentMain";
import { EquipmentConfig } from "./EquipmentConfig";
import { ItemSheetFramework } from "../ItemSheetFramework/SheetFramework";
import { ModeSelect } from "../ItemSheetFramework/ModeSelect";
import { ItemSheetMode } from "../ItemSheetFramework/types";
import { assertEquipmentItem } from "../../v10Types";

type EquipmentSheetProps = {
  equipment: InvestigatorItem;
  application: ItemSheet;
};

export const EquipmentSheet: React.FC<EquipmentSheetProps> = ({
  equipment,
  application,
}) => {
  assertEquipmentItem(equipment);
  const name = useAsyncUpdate(equipment.name || "", equipment.setName);

  return (
    <ItemSheetFramework
      supertitle={<Translate>Equipment</Translate>}
      item={equipment}
      application={application}
    >
      <ModeSelect mode={ItemSheetMode.Main}>
        <EquipmentMain
          equipment={equipment}
          name={name.display}
          onChangeName={name.onChange}
        />
      </ModeSelect>
      <ModeSelect mode={ItemSheetMode.Config}>
        <EquipmentConfig equipment={equipment} />
      </ModeSelect>
    </ItemSheetFramework>
  );
};
