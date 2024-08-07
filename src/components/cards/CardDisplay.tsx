import React, { useContext } from "react";

import { ThemeContext } from "../../themes/ThemeContext";
import { assertCardItem, CardItem } from "../../v10Types";

interface CardDisplayProps {
  card: CardItem;
}

export const CardDisplay: React.FC<CardDisplayProps> = ({ card }) => {
  assertCardItem(card);
  const theme = useContext(ThemeContext);
  return (
    <div
      css={{
        ...theme.cardStyles.backdropStyle,
        border: "1px solid black",
        aspectRatio: "4/5",
      }}
    >
      <h2>{card.name}</h2>
      <p>{card.system.notes.html}</p>
    </div>
  );
};

CardDisplay.displayName = "Card";
