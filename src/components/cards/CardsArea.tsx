import React, { useContext } from "react";

import { getTranslated } from "../../functions/getTranslated";
import { sortEntitiesByName } from "../../functions/utilities";
import { InvestigatorActor } from "../../module/InvestigatorActor";
import { settings } from "../../settings/settings";
import { isCardItem } from "../../v10Types";
import { absoluteCover } from "../absoluteCover";
import { CardArray } from "./CardArray";
import { CategorizedCards } from "./CategorizedCards";
import { CardsAreaSettingsContext } from "./contexts";
import { CardsSortOrder, CardsViewMode } from "./types";

interface CardsAreaProps {
  actor: InvestigatorActor;
}

export const CardsArea: React.FC<CardsAreaProps> = ({ actor }) => {
  const allCards = actor.items.filter((item) => isCardItem(item));
  const categories = settings.cardCategories.get();
  const {
    cardsAreaSettings: { category, sortOrder, viewMode },
    updateCardsAreaSettings,
  } = useContext(CardsAreaSettingsContext);
  const filteredCards = allCards.filter((card) => {
    if (category === "" || category === "__categorized") {
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
          <option value={""}>{getTranslated("All")}</option>
          <option value={"__categorized"}>
            {getTranslated("Categorized")}
          </option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
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
        {category === "__categorized" ? (
          <CategorizedCards cards={cards} />
        ) : (
          <CardArray cards={cards} />
        )}
      </div>
    </div>
  );
};
