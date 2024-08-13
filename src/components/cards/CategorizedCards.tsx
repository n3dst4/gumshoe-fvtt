import React, { Fragment } from "react";

import { settings } from "../../settings/settings";
import { CardItem } from "../../v10Types";
import { CardArray } from "./CardArray";

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
      cards.filter((card) => card.system.categoryId === cat.id),
    ]),
  );
  return categories.map((cat, i) => (
    <Fragment key={cat.id}>
      {i !== 0 && <hr css={{ margin: "3em 0em 0em" }} />}
      {/* <hr css={{ margin: "3em 0em 0em" }} /> */}
      <h2>{cat.name}</h2>
      <CardArray cards={categoriesMap[cat.id]} />
      {/* <Masonry minColumnWidth="12em" columnGap="0.5em">
        {categoriesMap[cat.id].map((card) => (
          <CardDisplay key={card.id} card={card} />
        ))}
      </Masonry> */}
    </Fragment>
  ));
};

CategorizedCards.displayName = "CategorizedCards";
