import React, { useContext } from "react";

import { ThemeContext } from "../../themes/ThemeContext";
import { CardItem } from "../../v10Types";
import { CardDisplay } from "./CardDisplay";
import { showCategorizedCardsToken } from "./consts";
import { CardsAreaSettingsContext } from "./contexts";

interface CardArrayCardProps {
  card: CardItem;
  className?: string;
}

export const CardArrayCard: React.FC<CardArrayCardProps> = ({
  card,
  className,
}) => {
  const theme = useContext(ThemeContext);
  const {
    cardsAreaSettings: { category: categorySetting, viewMode },
  } = useContext(CardsAreaSettingsContext);

  const showCategory = !(categorySetting === showCategorizedCardsToken);

  return (
    <CardDisplay
      key={card.id}
      className={className}
      card={card}
      css={{
        cursor: "pointer",
        marginBottom: theme.cardStyles.verticalSpacing,
        opacity: card.system.active ? 1 : 0.5,
        transition: "opacity 0.2s ease-in-out",
        ":hover": theme.cardStyles.hoverStyle,
      }}
      showCategory={showCategory}
      viewMode={viewMode}
    />
  );
};

CardArrayCard.displayName = "CardArrayCard";
