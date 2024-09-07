import { CardStyles } from "@lumphammer/investigator-fvtt-types";
import React, { useCallback, useContext, useEffect, useState } from "react";

import { getTranslated } from "../../functions/getTranslated";
import { cleanAndEnrichHtml } from "../../functions/textFunctions";
import { getById, isNullOrEmptyString } from "../../functions/utilities";
import { settings } from "../../settings/settings";
import { ThemeContext } from "../../themes/ThemeContext";
import { assertCardItem, CardItem } from "../../v10Types";
import { CardsViewMode } from "./types";

interface CardDisplayProps {
  card: CardItem;
  className?: string;
  viewMode: CardsViewMode;
  showCategory: boolean;
  draggable?: boolean;
  onDragStart?: (event: React.DragEvent<HTMLElement>) => void;
}

export const CardDisplay: React.FC<CardDisplayProps> = ({
  card,
  className,
  viewMode,
  showCategory,
  draggable,
  onDragStart,
}) => {
  assertCardItem(card);
  const theme = useContext(ThemeContext);
  const [descriptionHTML, setDescriptionHTML] = useState("");
  const [effectsHTML, setEffectsHTML] = useState("");
  const allCategories = settings.cardCategories.get();
  const categories = card.system.categoryMemberships
    .map((m) => getById(allCategories, m.categoryId))
    .filter((c) => !!c);

  const handleClick = useCallback(() => {
    card.sheet?.render(true);
  }, [card.sheet]);

  const showText = viewMode === "full";

  useEffect(() => {
    void cleanAndEnrichHtml(card.system.description.html).then(
      setDescriptionHTML,
    );
  }, [card.system.description.html]);

  useEffect(() => {
    void cleanAndEnrichHtml(card.system.effects.html).then(setEffectsHTML);
  }, [card.system.effects.html]);

  // const categoryTheme = category?.styleKey
  //   ? theme.cards.categories[category?.styleKey]
  //   : null;

  // XXX
  const categoryTheme = null as CardStyles | null;

  // XXX
  const styleKey = "";

  const supertitleText = [
    // category name
    categories && showCategory
      ? categories.map((c) => c.singleName).join(", ")
      : null,
    // active
    !card.system.active ? getTranslated("Inactive") : null,
    // continuity
    card.system.continuity ? getTranslated("Continuity") : null,
    // supertitle text
    !isNullOrEmptyString(card.system.supertitle)
      ? card.system.supertitle
      : null,
  ]
    .filter(Boolean)
    .join(" / ");

  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      data-item-id={card.id}
      tabIndex={0}
      onClick={handleClick}
      className={`investigator-card-display ${className} ${styleKey}`}
      css={{
        ...theme.cards.base.backdropStyle,
        ...categoryTheme?.backdropStyle,
      }}
    >
      {supertitleText && (
        <p
          className="supertitle"
          css={{
            ...theme.cards.base.supertitleStyle,
            ...categoryTheme?.supertitleStyle,
          }}
        >
          {supertitleText}
        </p>
      )}
      <h2
        className="title"
        css={{
          ...theme.cards.base.titleStyle,
          ...categoryTheme?.titleStyle,
        }}
      >
        {card.name}
      </h2>
      {!isNullOrEmptyString(card.system.subtitle) && (
        <p
          className="subtitle"
          css={{
            ...theme.cards.base.subtitleStyle,
            ...categoryTheme?.subtitleStyle,
          }}
        >
          {card.system.subtitle}
        </p>
      )}
      {showText && !isNullOrEmptyString(descriptionHTML) && (
        <p
          className="description"
          css={{
            ...theme.cards.base.descriptionStyle,
            ...categoryTheme?.descriptionStyle,
          }}
          dangerouslySetInnerHTML={{ __html: descriptionHTML }}
        ></p>
      )}
      {showText && !isNullOrEmptyString(effectsHTML) && (
        <p
          className="effects"
          css={{
            ...theme.cards.base.effectStyle,
            ...categoryTheme?.effectStyle,
          }}
          dangerouslySetInnerHTML={{ __html: effectsHTML }}
        ></p>
      )}
    </div>
  );
};

CardDisplay.displayName = "CardDisplay";
