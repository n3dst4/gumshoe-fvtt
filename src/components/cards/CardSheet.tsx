import React from "react";

import { InvestigatorItem } from "../../module/InvestigatorItem";
import { ModeSelect } from "../ItemSheetFramework/ModeSelect";
import { ItemSheetFramework } from "../ItemSheetFramework/SheetFramework";
import { ItemSheetMode } from "../ItemSheetFramework/types";
import { Translate } from "../Translate";

type CardSheetProps = {
  item: InvestigatorItem;
  application: ItemSheet;
};

export const CardSheet: React.FC<CardSheetProps> = ({ item, application }) => {
  return (
    <ItemSheetFramework
      supertitle={<Translate>Card</Translate>}
      item={item}
      application={application}
    >
      <ModeSelect mode={ItemSheetMode.Main}>Card parts</ModeSelect>
      <ModeSelect mode={ItemSheetMode.Config}>Crad config</ModeSelect>
    </ItemSheetFramework>
  );
};
