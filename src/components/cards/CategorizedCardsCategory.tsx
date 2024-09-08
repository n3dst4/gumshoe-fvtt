import { CardCategory } from "@lumphammer/investigator-fvtt-types";
import React from "react";

import { getTranslated } from "../../functions/getTranslated";
import { CardItem } from "../../v10Types";
import { CardArray } from "./CardArray";

interface CategorizedCardsCategoryProps {
  category: CardCategory;
  cards: CardItem[];
}

function totaliseCards(cards: CardItem[], categoryId: string) {
  return cards.reduce((acc, card) => {
    const membership = card.system.categoryMemberships.find(
      (m) => m.categoryId === categoryId,
    );
    return acc + (membership?.worth ?? 0);
  }, 0);
}

export const CategorizedCardsCategory: React.FC<
  CategorizedCardsCategoryProps
> = ({ category, cards }) => {
  const grandTotal = totaliseCards(cards, category.id);

  const indexOfLastLethalCard = cards
    .map((card) => {
      const membership = card.system.categoryMemberships.find(
        (m) => m.categoryId === category.id,
      );
      return membership?.nonlethal ?? false;
    })
    .lastIndexOf(false);

  const lethalCards = cards.slice(0, indexOfLastLethalCard + 1);

  const lethalCardsTotal = totaliseCards(lethalCards, category.id);

  let total = "";
  if (category.thresholdType === "limit") {
    total = `${lethalCardsTotal}/${getTranslated("Limit")} ${grandTotal}`;
  } else if (category.thresholdType === "goal") {
    total = `${grandTotal}/${getTranslated("Goal")} ${category.threshold}`;
  } else {
    total = grandTotal.toString();
  }

  return (
    <>
      <h2>
        {category.pluralName} ({total})
      </h2>
      <CardArray cards={cards} />
    </>
  );
};

CategorizedCardsCategory.displayName = "CategorizedCardsCategory";
