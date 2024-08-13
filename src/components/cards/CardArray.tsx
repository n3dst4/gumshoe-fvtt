import React, { useContext } from "react";

import { ThemeContext } from "../../themes/ThemeContext";
import { CardItem } from "../../v10Types";
import { Masonry } from "../Masonry";
import { Translate } from "../Translate";
import { CardDisplay } from "./CardDisplay";

interface CardArrayProps {
  cards: CardItem[];
}

export const CardArray: React.FC<CardArrayProps> = ({ cards }) => {
  const theme = useContext(ThemeContext);
  if (cards.length === 0) {
    return (
      <div
        css={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "start",
          alignItems: "center",
          fontSize: "1.5em",
          color: theme.colors.text,
          opacity: 0.5,
          margin: "1em 0em",
        }}
      >
        <Translate>No cards</Translate>
      </div>
    );
  }

  return (
    <Masonry minColumnWidth="12em" columnGap="0.5em">
      {cards.map((card) => (
        <CardDisplay key={card.id} card={card} />
      ))}
    </Masonry>
  );
};

CardArray.displayName = "CardArray";
