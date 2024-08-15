import React, { useCallback, useContext, useEffect, useState } from "react";

import { cleanAndEnrichHtml } from "../../functions/textFunctions";
import {
  callFromPromise,
  getById,
  isNullOrEmptyString,
} from "../../functions/utilities";
import { settings } from "../../settings/settings";
import { ThemeContext } from "../../themes/ThemeContext";
import { assertCardItem, CardItem } from "../../v10Types";
import { showCategorizedCardsToken } from "./consts";
import { CardsAreaSettingsContext } from "./contexts";

interface CardDisplayProps {
  card: CardItem;
}

export const CardDisplay: React.FC<CardDisplayProps> = ({ card }) => {
  assertCardItem(card);
  const theme = useContext(ThemeContext);
  const {
    cardsAreaSettings: { category: categorySetting, viewMode },
  } = useContext(CardsAreaSettingsContext);
  const [descriptionHTML, setDescriptionHTML] = useState("");
  const [effectsHTML, setEffectsHTML] = useState("");
  const category = getById(
    settings.cardCategories.get(),
    card.system.categoryId,
  );

  const handleClick = useCallback(() => {
    card.sheet?.render(true);
  }, [card.sheet]);

  const showText = viewMode === "expanded";

  useEffect(() => {
    void callFromPromise(
      cleanAndEnrichHtml(card.system.description.html),
      setDescriptionHTML,
    );
  }, [card.system.description.html]);

  useEffect(() => {
    void callFromPromise(
      cleanAndEnrichHtml(card.system.effects.html),
      setEffectsHTML,
    );
  }, [card.system.effects.html]);

  return (
    <div
      tabIndex={0}
      onClick={handleClick}
      className="card-display"
      css={{
        ...theme.cardStyles.backdropStyle,
        overflow: "hidden",
        marginBottom: "0.5em",
      }}
    >
      <p css={theme.cardStyles.supertitleStyle}>
        {category && !(categorySetting === showCategorizedCardsToken)
          ? category.singleName
          : ""}
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
