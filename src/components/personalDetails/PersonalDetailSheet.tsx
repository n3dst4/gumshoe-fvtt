import React from "react";
import { assertPersonalDetailDataSource } from "../../typeAssertions";
interface PersonalDetailSheetProps {
  personalDetail: Item;
}

export const PersonalDetailSheet: React.FC<PersonalDetailSheetProps> = ({
  personalDetail,
}) => {
  assertPersonalDetailDataSource(personalDetail.data);

  return <div>Personal detail: {personalDetail.name}</div>;
};

PersonalDetailSheet.displayName = "PersonalDetailSheet";
