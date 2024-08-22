import React, { useCallback, useContext, useEffect, useState } from "react";

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
  const category = getById(
    settings.cardCategories.get(),
    card.system.categoryId,
  );

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

  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      data-item-id={card.id}
      tabIndex={0}
      onClick={handleClick}
      className={`card-display ${className}`}
      css={theme.cardStyles.backdropStyle}
    >
      <p css={theme.cardStyles.supertitleStyle}>
        {category && showCategory ? category.singleName : ""}
        {"  "}
        {!isNullOrEmptyString(card.system.supertitle) && card.system.supertitle}
      </p>
      <h2 css={theme.cardStyles.titleStyle}>{card.name}</h2>
      {!isNullOrEmptyString(card.system.subtitle) && (
        <p css={theme.cardStyles.subtitleStyle}>{card.system.subtitle}</p>
      )}
      {showText && !isNullOrEmptyString(descriptionHTML) && (
        <p
          css={theme.cardStyles.descriptionStyle}
          dangerouslySetInnerHTML={{ __html: descriptionHTML }}
        ></p>
      )}
      {showText && !isNullOrEmptyString(effectsHTML) && (
        <p
          css={theme.cardStyles.effectStyle}
          dangerouslySetInnerHTML={{ __html: effectsHTML }}
        ></p>
      )}
      {/* <Button onClick={handleClickExpand}>expand</Button> */}
    </div>
  );
};

CardDisplay.displayName = "CardDisplay";
