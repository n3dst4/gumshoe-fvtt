import { FoundryAppContext } from "@lumphammer/shared-fvtt-bits/src/FoundryAppContext";
import React, { useCallback, useContext } from "react";

import { ThemeContext } from "../../themes/ThemeContext";
import { CardItem } from "../../v10Types";
import { CardDisplay } from "./CardDisplay";
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
  const app = useContext(FoundryAppContext);

  const { category: categorySetting, viewMode } = useContext(
    CardsAreaSettingsContext,
  );

  const handleDragStart = useCallback(
    (e: React.DragEvent<HTMLElement>) => {
      if (app !== null) {
        (app as any)._onDragStart(e);
      }
    },
    [app],
  );

  const showCategory = !(categorySetting === "categorized");

  return (
    <div css={{ opacity: card.system.active ? 0.99 : 0.5 }}>
      <CardDisplay
        key={card.id}
        draggable
        onDragStart={handleDragStart}
        className={`investigator-card-array-card ${className}`}
        card={card}
        css={{
          cursor: "pointer",
          marginBottom: theme.cards.area.verticalSpacing,
          transition: "opacity 0.2s ease-in-out",
          ":hover": {
            ...theme.cards.base.hoverStyle,
            ...theme.cards.categories[card.system.categoryId]?.hoverStyle,
          },
        }}
        showCategory={showCategory}
        viewMode={viewMode}
      />
    </div>
  );
};

CardArrayCard.displayName = "CardArrayCard";
