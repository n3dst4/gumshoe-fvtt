import React, { useContext } from "react";

import { getTranslated } from "../../functions/getTranslated";
import { sortEntitiesByName } from "../../functions/utilities";
import { InvestigatorActor } from "../../module/InvestigatorActor";
import { settings } from "../../settings/settings";
import { isCardItem } from "../../v10Types";
import { absoluteCover } from "../absoluteCover";
import { CardArray } from "./CardArray";
import { CategorizedCards } from "./CategorizedCards";
import { showAllCardsToken, showCategorizedCardsToken } from "./consts";
import { CardsAreaSettingsContext } from "./contexts";
import { CardsColumnWidth, CardsSortOrder, CardsViewMode } from "./types";

interface CardsAreaProps {
  actor: InvestigatorActor;
}

export const CardsArea: React.FC<CardsAreaProps> = ({ actor }) => {
  const allCards = actor.items.filter((item) => isCardItem(item));
  const categories = settings.cardCategories.get();
  const {
    cardsAreaSettings: { category, sortOrder, viewMode, columnWidth },
    updateCardsAreaSettings,
  } = useContext(CardsAreaSettingsContext);
  const filteredCards = allCards.filter((card) => {
    if (
      category === showAllCardsToken ||
      category === showCategorizedCardsToken
    ) {
      return true;
    } else {
      return card.system.categoryId === category;
    }
  });

  let cards =
    sortOrder === "atoz" || sortOrder === "ztoa"
      ? sortEntitiesByName(filteredCards)
      : filteredCards;

  if (sortOrder === "newest" || sortOrder === "ztoa") {
    cards = cards.reverse();
  }

  const containerRef = React.useRef<HTMLDivElement>(null);

  return (
    <div
      css={{
        ...absoluteCover,
        display: "flex",
        flexDirection: "column",
        padding: "0.5em",
      }}
    >
      <div css={{ paddingBottom: "0.5em" }}>
        {/* category */}
        <select
          value={category}
          onChange={(e) => {
            updateCardsAreaSettings({
              category: e.currentTarget.value,
            });
          }}
        >
          <option value={showAllCardsToken}>{getTranslated("All")}</option>
          <option value={showCategorizedCardsToken}>
            {getTranslated("Categorized")}
          </option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.pluralName}
            </option>
          ))}
        </select>{" "}
        {/* sort order */}
        <select
          value={sortOrder}
          onChange={(e) => {
            updateCardsAreaSettings({
              sortOrder: e.currentTarget.value as CardsSortOrder,
            });
          }}
        >
          <option value="newest">{getTranslated("Newest")}</option>
          <option value="oldest">{getTranslated("Oldest")}</option>
          <option value="atoz">{"A — Z"}</option>
          <option value="ztoa">{"Z — A"}</option>
        </select>{" "}
        {/* view mode */}
        <select
          value={viewMode}
          onChange={(e) => {
            updateCardsAreaSettings({
              viewMode: e.currentTarget.value as CardsViewMode,
            });
          }}
        >
          <option value="compact">{getTranslated("Compact")}</option>
          <option value="expanded">{getTranslated("Expanded")}</option>
        </select>{" "}
        {/* column width */}
        <select
          value={columnWidth}
          onChange={(e) => {
            updateCardsAreaSettings({
              columnWidth: e.currentTarget.value as CardsColumnWidth,
            });
          }}
        >
          <option value="narrow">{getTranslated("Narrow")}</option>
          <option value="wide">{getTranslated("Wide")}</option>
          <option value="full">{getTranslated("Full width")}</option>
        </select>
      </div>
      <div
        className="container-ref-haver"
        ref={containerRef}
        css={{
          flex: 1,
          overflow: "auto",
        }}
      >
        {category === showCategorizedCardsToken ? (
          <CategorizedCards cards={cards} />
        ) : (
          <CardArray cards={cards} />
        )}
      </div>
    </div>
  );
};
