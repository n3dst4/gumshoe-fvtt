import { ModeSelect } from "../ItemSheetFramework/ModeSelect";
import { ItemSheetFramework } from "../ItemSheetFramework/SheetFramework";
import { ItemSheetMode } from "../ItemSheetFramework/types";
import { Translate } from "../Translate";
import { WeaponConfig } from "./WeaponConfig";
import { WeaponMain } from "./WeaponMain";

export const WeaponSheet = () => {
  return (
    <ItemSheetFramework supertitle={<Translate>Weapon</Translate>}>
      <ModeSelect mode={ItemSheetMode.Main}>
        <WeaponMain />
      </ModeSelect>
      <ModeSelect mode={ItemSheetMode.Config}>
        <WeaponConfig />
      </ModeSelect>
    </ItemSheetFramework>
  );
};
