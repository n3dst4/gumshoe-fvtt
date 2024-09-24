import React, { Fragment } from "react";

import { settings } from "../../settings/settings";
import { CardItem } from "../../v10Types";
import { CategorizedCardArrayCategory } from "./CategorizedCardArrayCategory";
import { categorizeCards } from "./functions";

interface CategorizedCardArrayProps {
  cards: CardItem[];
}

export const CategorizedCardArray = ({ cards }: CategorizedCardArrayProps) => {
  const categories = settings.cardCategories.get();
  const [categoriesMap, uncategorized] = categorizeCards(cards, categories);

  return (
    <>
      {categories.map((cat, i) => (
        <Fragment key={cat.id}>
          {i !== 0 && <hr css={{ margin: "2em 0em 0em" }} />}
          <CategorizedCardArrayCategory
            category={cat}
            cards={categoriesMap[cat.id]}
          />
        </Fragment>
      ))}
      {uncategorized.length > 0 && (
        <>
          <hr css={{ margin: "2em 0em 0em" }} />
          <CategorizedCardArrayCategory category={null} cards={uncategorized} />
        </>
      )}
    </>
  );
};

CategorizedCardArray.displayName = "CategorizedCardArray";
