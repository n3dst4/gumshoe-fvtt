import { useAsyncUpdate } from "../../hooks/useAsyncUpdate";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { assertEquipmentItem } from "../../v10Types";
import { ModeSelect } from "../ItemSheetFramework/ModeSelect";
import { ItemSheetFramework } from "../ItemSheetFramework/SheetFramework";
import { ItemSheetMode } from "../ItemSheetFramework/types";
import { Translate } from "../Translate";
import { EquipmentConfig } from "./EquipmentConfig";
import { EquipmentMain } from "./EquipmentMain";

type EquipmentSheetProps = {
  equipment: InvestigatorItem;
  application: ItemSheet;
};

export const EquipmentSheet = ({
  equipment,
  application,
}: EquipmentSheetProps) => {
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
