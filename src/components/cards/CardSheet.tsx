import React from "react";

import { InvestigatorItem } from "../../module/InvestigatorItem";
import { assertCardItem } from "../../v10Types";
import { ModeSelect } from "../ItemSheetFramework/ModeSelect";
import { ItemSheetFramework } from "../ItemSheetFramework/SheetFramework";
import { ItemSheetMode } from "../ItemSheetFramework/types";
import { Translate } from "../Translate";
import { CardConfig } from "./CardConfig";
import { CardMain } from "./CardMain";

type CardSheetProps = {
  card: InvestigatorItem;
  application: ItemSheet;
};

export const CardSheet: React.FC<CardSheetProps> = ({ card, application }) => {
  assertCardItem(card);
  return (
    <ItemSheetFramework
      supertitle={<Translate>Card</Translate>}
      item={card}
      application={application}
    >
      <ModeSelect mode={ItemSheetMode.Main}>
        <CardMain card={card} />
      </ModeSelect>
      <ModeSelect mode={ItemSheetMode.Config}>
        <CardConfig card={card} />
      </ModeSelect>
    </ItemSheetFramework>
  );
};
