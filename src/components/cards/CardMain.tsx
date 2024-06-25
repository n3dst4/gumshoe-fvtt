import React from "react";

import { InvestigatorItem } from "../../module/InvestigatorItem";
import { assertCardItem } from "../../v10Types";
import { Checkbox } from "../inputs/Checkbox";
import { GridField } from "../inputs/GridField";
import { InputGrid } from "../inputs/InputGrid";
import { TextInput } from "../inputs/TextInput";

interface CardMainProps {
  card: InvestigatorItem;
  name: string;
}

export const CardMain: React.FC<CardMainProps> = ({ card, name }) => {
  assertCardItem(card);
  return (
    <InputGrid>
      <GridField label="Item Name">
        <TextInput value={name} onChange={card.setName} />
      </GridField>
      <GridField label="Active">
        <Checkbox checked={card.system.active} onChange={card.setActive} />
      </GridField>
    </InputGrid>
  );
};
