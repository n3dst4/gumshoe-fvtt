import React, { ChangeEvent, useCallback } from "react";

import { getTranslated } from "../../functions/getTranslated";
import { getById } from "../../functions/utilities";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { settings } from "../../settings/settings";
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

  const categories = settings.cardCategories.get();
  const categoryMetadata = getById(categories, card.system.category);
  const isRealCategory = categoryMetadata !== undefined;

  const onChangeCategory = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      void card.setCategory(e.currentTarget.value);
    },
    [card],
  );

  const selectedCat = isRealCategory ? card.system.category : "";

  return (
    <InputGrid>
      <GridField label="Item Name">
        <TextInput value={name} onChange={card.setName} />
      </GridField>
      <GridField label="Category">
        <div
          css={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <div>
            <select
              value={selectedCat}
              onChange={onChangeCategory}
              css={{
                lineHeight: "inherit",
                height: "inherit",
              }}
            >
              {Object.entries(categories).map<JSX.Element>(([id, cat]) => (
                <option key={id} value={id}>
                  {cat.name}
                </option>
              ))}
              <option value="">{getTranslated("Uncategorized")}</option>
            </select>
          </div>
        </div>
      </GridField>
      <GridField label="Active">
        <Checkbox checked={card.system.active} onChange={card.setActive} />
      </GridField>
    </InputGrid>
  );
};
