import { useItemSheetContext } from "../../hooks/useSheetContexts";
import { assertPersonalDetailItem } from "../../v10Types";
import { ModeSelect } from "../ItemSheetFramework/ModeSelect";
import { ItemSheetFramework } from "../ItemSheetFramework/SheetFramework";
import { ItemSheetMode } from "../ItemSheetFramework/types";
import { PersonalDetailConfig } from "./PersonalDetailConfig";
import { PersonalDetailMain } from "./PersonalDetailMain";

export const PersonalDetailSheet = () => {
  const { item } = useItemSheetContext();
  assertPersonalDetailItem(item);

  return (
    <ItemSheetFramework>
      <ModeSelect mode={ItemSheetMode.Main}>
        <PersonalDetailMain />
      </ModeSelect>
      <ModeSelect mode={ItemSheetMode.Config}>
        <PersonalDetailConfig />
      </ModeSelect>
    </ItemSheetFramework>
  );

  return <div>Personal detail: {item.name}</div>;
};

PersonalDetailSheet.displayName = "PersonalDetailSheet";
