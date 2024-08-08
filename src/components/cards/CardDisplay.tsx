import React, { useCallback, useContext } from "react";

import { isNullOrEmptyString } from "../../functions/utilities";
import { ThemeContext } from "../../themes/ThemeContext";
import { assertCardItem, CardItem } from "../../v10Types";

interface CardDisplayProps {
  card: CardItem;
}

export const CardDisplay: React.FC<CardDisplayProps> = ({ card }) => {
  assertCardItem(card);
  const theme = useContext(ThemeContext);

  const handleClick = useCallback(() => {
    card.sheet?.render(true);
  }, [card.sheet]);

  return (
    <div
      tabIndex={0}
      onClick={handleClick}
      className="card-display"
      css={{
        ...theme.cardStyles.backdropStyle,
        aspectRatio: "4/5",
      }}
    >
      {!isNullOrEmptyString(card.system.supertitle) && (
        <p css={theme.cardStyles.supertitleStyle}>{card.system.supertitle}</p>
      )}
      <h2 css={theme.cardStyles.titleStyle}>{card.name}</h2>
      {!isNullOrEmptyString(card.system.subtitle) && (
        <p css={theme.cardStyles.subtitleStyle}>{card.system.subtitle}</p>
      )}
      {!isNullOrEmptyString(card.system.description.html) && (
        <p
          css={theme.cardStyles.descriptionStyle}
          dangerouslySetInnerHTML={{ __html: card.system.description.html }}
        ></p>
      )}
      {!isNullOrEmptyString(card.system.effects.html) && (
        <p
          css={theme.cardStyles.effectStyle}
          dangerouslySetInnerHTML={{ __html: card.system.effects.html }}
        ></p>
      )}
    </div>
  );
};

CardDisplay.displayName = "CardDisplay";
