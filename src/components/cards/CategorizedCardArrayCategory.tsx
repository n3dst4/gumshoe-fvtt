import { CardCategory } from "@lumphammer/investigator-fvtt-types";
import React, { useContext } from "react";

import { getTranslated } from "../../functions/getTranslated";
import { ThemeContext } from "../../themes/ThemeContext";
import { CardItem } from "../../v10Types";
import { CardArray } from "./CardArray";
import { summarizeCategoryCards } from "./functions";

interface CategorizedCardArrayCategoryProps {
  category: CardCategory | null;
  cards: CardItem[];
}

export const CategorizedCardArrayCategory: React.FC<
  CategorizedCardArrayCategoryProps
> = ({ category, cards }) => {
  const theme = useContext(ThemeContext);
  const [summary, isOverGoal, isOverLimit] = summarizeCategoryCards(
    cards,
    category,
  );
  return (
    <>
      <h2
        css={{
          color: isOverGoal
            ? theme.colors.success
            : isOverLimit
              ? theme.colors.danger
              : undefined,
        }}
      >
        {category?.pluralName ?? getTranslated("Uncategorized")} ({summary})
      </h2>
      <CardArray cards={cards} />
    </>
  );
};

CategorizedCardArrayCategory.displayName = "CategorizedCardArrayCategory";