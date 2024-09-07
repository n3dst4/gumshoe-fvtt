import { CardCategory } from "@lumphammer/investigator-fvtt-types";
import React from "react";

import { CardItem } from "../../v10Types";
import { AsyncNumberInput } from "../inputs/AsyncNumberInput";
import { Toggle } from "../inputs/Toggle";

interface CategoryMembershipRowProps {
  category: CardCategory;
  card: CardItem;
}

export const CategoryMembershipRow: React.FC<CategoryMembershipRowProps> = ({
  category,
  card,
}) => {
  const membership = card.system.categoryMemberships.find(
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
    <div
      css={{
        display: "grid",
        gridTemplateColumns: "subgrid",
        gridColumn: "1 / -1",
      }}
    >
      <div>{category.singleName}</div>
      <div>
        <Toggle checked={!!membership} onChange={handleToggleActive} />
      </div>
      {membership && (
        <>
          <div>
            <Toggle
              checked={membership.nonlethal}
              onChange={handleToggleNonlethal}
            />
          </div>
          <div>
            <AsyncNumberInput
              min={0}
              value={membership.worth}
              onChange={handleSetWorth}
            />
          </div>
        </>
      )}
    </div>
  );
};

CategoryMembershipRow.displayName = "CategoryMembershipRow";
