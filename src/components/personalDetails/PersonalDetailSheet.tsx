import React from "react";

import { InvestigatorItem } from "../../module/InvestigatorItem";
import { assertPersonalDetailItem } from "../../v10Types";
import { ModeSelect } from "../ItemSheetFramework/ModeSelect";
import { ItemSheetFramework } from "../ItemSheetFramework/SheetFramework";
import { ItemSheetMode } from "../ItemSheetFramework/types";
import { PersonalDetailConfig } from "./PersonalDetailConfig";
import { PersonalDetailMain } from "./PersonalDetailMain";
interface PersonalDetailSheetProps {
  application: DocumentSheet;
  personalDetail: InvestigatorItem;
}

export const PersonalDetailSheet: React.FC<PersonalDetailSheetProps> = ({
  personalDetail,
  application,
}) => {
  assertPersonalDetailItem(personalDetail);

  return (
    <ItemSheetFramework application={application} item={personalDetail}>
      <ModeSelect mode={ItemSheetMode.Main}>
        <PersonalDetailMain item={personalDetail} />
      </ModeSelect>
      <ModeSelect mode={ItemSheetMode.Config}>
        <PersonalDetailConfig item={personalDetail} />
      </ModeSelect>
    </ItemSheetFramework>
  );

  return <div>Personal detail: {personalDetail.name}</div>;
};

PersonalDetailSheet.displayName = "PersonalDetailSheet";
