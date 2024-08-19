import React, { useContext } from "react";

import { ThemeContext } from "../../themes/ThemeContext";
import { CardItem } from "../../v10Types";
import { Masonry } from "../Masonry";
import { Translate } from "../Translate";
import { CardDisplay } from "./CardDisplay";
import { CardsAreaSettingsContext } from "./contexts";
import { CardsColumnWidth } from "./types";

interface CardArrayProps {
  cards: CardItem[];
}

const columndWidths: Record<CardsColumnWidth, string> = {
  narrow: "12em",
  wide: "18em",
  full: "100%",
};

export const CardArray: React.FC<CardArrayProps> = ({ cards }) => {
  const theme = useContext(ThemeContext);
  const {
    cardsAreaSettings: { columnWidth: columnWidthSetting },
  } = useContext(CardsAreaSettingsContext);

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
    <Masonry
      minColumnWidth={columndWidths[columnWidthSetting]}
      columnGap="0.5em"
      css={{
        margin: "0.5em",
      }}
    >
      {cards.map((card) => (
        <CardDisplay
          key={card.id}
          css={{
            cursor: "pointer",
            ":hover": {
              ...theme.cardStyles.hoverStyle,
              zIndex: 10,
            },
          }}
          card={card}
        />
      ))}
    </Masonry>
  );
};

CardArray.displayName = "CardArray";
