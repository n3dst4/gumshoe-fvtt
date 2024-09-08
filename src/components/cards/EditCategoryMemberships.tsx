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
    <InputGrid>
      {categories.map((category, index) => (
        <CategoryMembershipRow
          key={category.id}
          card={card}
          category={category}
          index={index}
        />
      ))}
    </InputGrid>
  );
};

EditCategoryMemberships.displayName = "EditCategoryMemberships";
