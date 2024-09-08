import { CSSObject } from "@lumphammer/investigator-fvtt-types";
import React, { useContext } from "react";

import { getTranslated } from "../../functions/getTranslated";
import { settings } from "../../settings/settings";
import { ThemeContext } from "../../themes/ThemeContext";
import { CardItem } from "../../v10Types";
import { GridField } from "../inputs/GridField";
import { InputGrid } from "../inputs/InputGrid";
import { CategoryMembershipRow } from "./CategoryMembershipRow";

interface EditCategoryMembershipsProps {
  card: CardItem;
}

export const EditCategoryMemberships: React.FC<
  EditCategoryMembershipsProps
> = ({ card }) => {
  const categories = settings.cardCategories.get();

  const theme = useContext(ThemeContext);

  // TODO this can go away if we redo grid labels
  const labelStyle: CSSObject = {
    "&&": {
      font: theme.bodyFont,
      fontWeight: "bold",
      paddingRight: "1em",
      textAlign: "end",
    },
  };

  const handleChangeStyleKeyCategoryId = React.useCallback(
    async (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.currentTarget.value === "" ? null : e.currentTarget.value;
      await card.setCardStyleKeyCategoryId(value);
    },
    [card],
  );

  return (
    <>
      <InputGrid>
        <GridField label="Appearance" labelStyle={labelStyle}>
          <select
            value={card.system.styleKeyCategoryId ?? ""}
            onChange={handleChangeStyleKeyCategoryId}
          >
            <option value={""}>{getTranslated("Uncategorized")}</option>
            {categories
              .filter((category) =>
                card.system.categoryMemberships.some(
                  (m) => m.categoryId === category.id,
                ),
              )
              .map((category) => (
                <option key={category.id} value={category.id}>
                  {category.singleName}
                </option>
              ))}
          </select>
        </GridField>
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
