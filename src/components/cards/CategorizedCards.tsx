import React, { Fragment } from "react";

import { settings } from "../../settings/settings";
import { CardItem } from "../../v10Types";
import { CategorizedCardsCategory } from "./CategorizedCardsCategory";

interface CategorizedCardsProps {
  cards: CardItem[];
}

export const CategorizedCards: React.FC<CategorizedCardsProps> = ({
  cards,
}) => {
  const categories = settings.cardCategories.get();
  const categoriesMap = Object.fromEntries(
    categories.map((cat) => [
      cat.id,
      cards.filter((card) =>
        card.system.categoryMemberships.some((m) => m.categoryId === cat.id),
      ),
    ]),
  );
  return categories.map((cat, i) => (
    <Fragment key={cat.id}>
      {i !== 0 && <hr css={{ margin: "3em 0em 0em" }} />}
      <CategorizedCardsCategory category={cat} cards={categoriesMap[cat.id]} />
    </Fragment>
  ));
};

CategorizedCards.displayName = "CategorizedCards";
