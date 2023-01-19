import React from "react";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { assertPersonalDetailDataSource } from "../../typeAssertions";
import { ModeSelect } from "../ItemSheetFramework/ModeSelect";
import { ItemSheetFramework } from "../ItemSheetFramework/SheetFramework";
import { ItemSheetMode } from "../ItemSheetFramework/types";
interface PersonalDetailSheetProps {
  application: DocumentSheet;
  personalDetail: InvestigatorItem;
}

export const PersonalDetailSheet: React.FC<PersonalDetailSheetProps> = ({
  personalDetail,
  application,
}) => {
  assertPersonalDetailDataSource(personalDetail.data);

  return (
    <ItemSheetFramework application={application} item={personalDetail}>
      <ModeSelect mode={ItemSheetMode.Main}>
        <div>Personal detail: {personalDetail.name}</div>
      </ModeSelect>
      <ModeSelect mode={ItemSheetMode.Config}>
        <div>Config: {personalDetail.name}</div>
      </ModeSelect>
    </ItemSheetFramework>
  );

  return <div>Personal detail: {personalDetail.name}</div>;
};

PersonalDetailSheet.displayName = "PersonalDetailSheet";
