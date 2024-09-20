import { CardCategory } from "@lumphammer/investigator-fvtt-types";
import React from "react";

import { CardItem } from "../../v10Types";
import { AsyncNumberInput } from "../inputs/AsyncNumberInput";
import { GridField } from "../inputs/GridField";
import { GridFieldStacked } from "../inputs/GridFieldStacked";
import { Toggle } from "../inputs/Toggle";

interface CategoryMembershipRowProps {
  category: CardCategory;
  card: CardItem;
  index: number;
  styleKeyCategoryId: string | null;
}

export const CategoryMembershipRow: React.FC<CategoryMembershipRowProps> = ({
  category,
  card,
  index,
  styleKeyCategoryId,
}) => {
  const membership = card.system.cardCategoryMemberships.find(
    (m) => m.categoryId === category.id,
  );

  const handleToggleActive = React.useCallback(
    async (active: boolean) => {
      if (active) {
        await card.addCardCategoryMembership(category.id);
      } else {
        await card.removeCardCategoryMembership(category.id);
      }
      console.log("toggle active");
    },
    [card, category.id],
  );

  const handleToggleNonlethal = React.useCallback(
    async (nonlethal: boolean) => {
      await card.setCardCategoryMembershipNonlethal(category.id, nonlethal);
    },
    [card, category.id],
  );

  const handleSetWorth = React.useCallback(
    async (worth: number) => {
      await card.setCardCategoryMembershipWorth(category.id, worth);
    },
    [card, category.id],
  );

  return (
    <>
      <GridFieldStacked key={category.id}>
        {index !== 0 && <hr css={{ margin: "1em 0em" }} />}
        <h2>{category.singleName}</h2>
      </GridFieldStacked>
      <GridField label="Active">
        <Toggle checked={!!membership} onChange={handleToggleActive} />
      </GridField>
      {membership && category.thresholdType !== "none" && (
        <GridField label="Worth">
          <AsyncNumberInput
            value={membership.worth}
            onChange={handleSetWorth}
          />
        </GridField>
      )}
      {membership && category.thresholdType === "limit" && (
        <GridField label="Nonlethal">
          <Toggle
            checked={membership.nonlethal}
            onChange={handleToggleNonlethal}
          />
        </GridField>
      )}
    </>
  );
};

CategoryMembershipRow.displayName = "CategoryMembershipRow";
