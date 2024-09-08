import React from "react";

import { settings } from "../../settings/settings";
import { CardItem } from "../../v10Types";
import { InputGrid } from "../inputs/InputGrid";
import { CategoryMembershipRow } from "./CategoryMembershipRow";

interface EditCategoryMembershipsProps {
  card: CardItem;
}

export const EditCategoryMemberships: React.FC<
  EditCategoryMembershipsProps
> = ({ card }) => {
  const categories = settings.cardCategories.get();

  return (
    <>
      <div>styleKeyCategoryId: {card.system.styleKeyCategoryId}</div>
      <div>
        Categories:{" "}
        {card.system.categoryMemberships.map((m) => m.categoryId).join(",")}
      </div>
      <InputGrid>
        {categories.map((category, index) => (
          <CategoryMembershipRow
            key={category.id}
            card={card}
            category={category}
            index={index}
            styleKeyCategoryId={card.system.styleKeyCategoryId}
          />
        ))}
      </InputGrid>
    </>
  );
};

EditCategoryMemberships.displayName = "EditCategoryMemberships";
