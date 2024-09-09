import React, { useContext } from "react";

import { getTranslated } from "../../functions/getTranslated";
import { settings } from "../../settings/settings";
import { ThemeContext } from "../../themes/ThemeContext";
import { CardItem } from "../../v10Types";
import { CardArray } from "./CardArray";
import { categorizeCards, summarizeCategoryCards } from "./functions";

interface UncategorizedCardArrayProps {
  cards: CardItem[];
}

export const UncategorizedCardArray: React.FC<UncategorizedCardArrayProps> = ({
  cards,
}) => {
  const categories = settings.cardCategories.get();
  const [categorizedCards, uncategorized] = categorizeCards(cards, categories);
  const theme = useContext(ThemeContext);

  const summary = Object.entries(categorizedCards).map(
    ([categoryId, cards], i) => {
      const category = categories.find((c) => c.id === categoryId);
      if (!category) {
        return "";
      }
      const [summary, isOverGoal, isOverLimit] = summarizeCategoryCards(
        cards,
        category,
      );
      return (
        <span
          key={categoryId}
          css={{
            color: isOverGoal
              ? theme.colors.accent
              : isOverLimit
                ? theme.colors.danger
                : undefined,
          }}
        >
          {i > 0 ? ", " : ""}
          {category.singleName}: {summary}
        </span>
      );
    },
  );

  return (
    <>
      <div>
        {summary}
        {uncategorized.length > 0 &&
          (categories.length > 0 ? ", " : "") +
            getTranslated("Uncategorized") +
            ": " +
            summarizeCategoryCards(uncategorized, null)[0]}
      </div>
      <CardArray cards={cards} />
    </>
  );
};

UncategorizedCardArray.displayName = "UncategorizedCardArray";
