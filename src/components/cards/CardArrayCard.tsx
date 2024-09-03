import { FoundryAppContext } from "@lumphammer/shared-fvtt-bits/src/FoundryAppContext";
import React, { useCallback, useContext } from "react";

import { getById } from "../../functions/utilities";
import { settings } from "../../settings/settings";
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

  const category = getById(
    settings.cardCategories.get(),
    card.system.categoryId,
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

  const categoryTheme = category?.styleKey
    ? theme.cards.categories[category?.styleKey]
    : null;

  return (
    // opacity has to be applied on a wrapper otherwise we break transform-style
    // (if used.) See https://stackoverflow.com/a/70627306/212676
    <div
      css={{
        opacity: card.system.active ? 1 : 0.5,
        transition: "opacity 0.2s ease-in-out",
        containerType: "inline-size",
      }}
    >
      <CardDisplay
        key={card.id}
        draggable
        onDragStart={handleDragStart}
        className={`investigator-card-array-card ${className}`}
        card={card}
        css={{
          cursor: "pointer",
          marginBottom: theme.cards.area.verticalSpacing,
          ":hover": {
            ...theme.cards.base.hoverStyle,
            ...categoryTheme?.hoverStyle,
          },
        }}
        showCategory={showCategory}
        viewMode={viewMode}
      />
    </div>
  );
};

CardArrayCard.displayName = "CardArrayCard";