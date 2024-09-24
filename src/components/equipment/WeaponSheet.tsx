import { ModeSelect } from "../ItemSheetFramework/ModeSelect";
import { ItemSheetFramework } from "../ItemSheetFramework/SheetFramework";
import { ItemSheetMode } from "../ItemSheetFramework/types";
import { Translate } from "../Translate";
import { WeaponAttack } from "./WeaponAttack";
import { WeaponConfig } from "./WeaponConfig";

export const WeaponSheet = () => {
  return (
    <ItemSheetFramework supertitle={<Translate>Weapon</Translate>}>
      <ModeSelect mode={ItemSheetMode.Main}>
        <WeaponAttack />
      </ModeSelect>
      <ModeSelect mode={ItemSheetMode.Config}>
        <WeaponConfig />
      </ModeSelect>
    </ItemSheetFramework>
  );
};
