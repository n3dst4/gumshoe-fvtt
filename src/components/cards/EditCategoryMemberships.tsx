import React, { useContext } from "react";

import { settings } from "../../settings/settings";
import { ThemeContext } from "../../themes/ThemeContext";
import { CardItem } from "../../v10Types";
import { Translate } from "../Translate";
import { CategoryMembershipRow } from "./CategoryMembershipRow";

interface EditCategoryMembershipsProps {
  card: CardItem;
}

export const EditCategoryMemberships: React.FC<
  EditCategoryMembershipsProps
> = ({ card }) => {
  const theme = useContext(ThemeContext);

  const categories = settings.cardCategories.get();

  return (
    <div
      css={{
        display: "grid",
        gridTemplateColumns: "auto auto auto auto",
        gap: "0.5em",
      }}
    >
      <div
        css={{
          borderBottom: `1px solid ${theme.colors.controlBorder}`,
          display: "grid",
          gridTemplateColumns: "subgrid",
          gridColumn: "1 / -1",
        }}
      >
        <Translate>Category</Translate>
        <Translate>Active</Translate>
        <Translate>Nonlethal</Translate>
        <Translate>Worth</Translate>
      </div>
      {categories.map((category) => (
        <CategoryMembershipRow
          key={category.id}
          category={category}
          card={card}
        />
      ))}
    </div>
  );
};

EditCategoryMemberships.displayName = "EditCategoryMemberships";
