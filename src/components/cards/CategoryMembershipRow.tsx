import { CardCategory, CSSObject } from "@lumphammer/investigator-fvtt-types";
import React, { useContext } from "react";

import { ThemeContext } from "../../themes/ThemeContext";
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
  const theme = useContext(ThemeContext);

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

  const handleToggleUseForStyleKey = React.useCallback(
    async (on: boolean) => {
      if (on) {
        await card.setCardStyleKeyCategoryId(category.id);
      } else {
        await card.unsetCardStyleKeyCategoryId();
      }
    },
    [card, category.id],
  );

  // TODO this can go away if we redo grid labels
  const labelStyle: CSSObject = {
    "&&": {
      font: theme.bodyFont,
      fontWeight: "bold",
      paddingRight: "1em",
      textAlign: "end",
    },
  };

  return (
    <>
      <GridFieldStacked key={category.id}>
        {index !== 0 && <hr css={{ margin: "1em 0em" }} />}
        <h2>{category.singleName}</h2>
      </GridFieldStacked>
      <GridField label="Active" labelStyle={labelStyle}>
        <Toggle checked={!!membership} onChange={handleToggleActive} />
      </GridField>
      {membership && (
        <GridField label="Appearance" labelStyle={labelStyle}>
          <Toggle
            checked={styleKeyCategoryId === category.id}
            onChange={handleToggleUseForStyleKey}
          />
        </GridField>
      )}
      {membership && category.thresholdType !== "none" && (
        <>
          <GridField label="Worth" labelStyle={labelStyle}>
            <AsyncNumberInput
              value={membership.worth}
              onChange={handleSetWorth}
            />
          </GridField>
          <GridField label="Nonlethal" labelStyle={labelStyle}>
            <Toggle
              checked={membership.nonlethal}
              onChange={handleToggleNonlethal}
            />
          </GridField>
        </>
      )}
    </>
  );
};

CategoryMembershipRow.displayName = "CategoryMembershipRow";
