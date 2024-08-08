import React from "react";

import { getTranslated } from "../../functions/getTranslated";
import { sortEntitiesByName } from "../../functions/utilities";
import { InvestigatorActor } from "../../module/InvestigatorActor";
import { settings } from "../../settings/settings";
import { isCardItem } from "../../v10Types";
import { absoluteCover } from "../absoluteCover";
import { CardDisplay } from "./CardDisplay";

interface CardsAreaProps {
  actor: InvestigatorActor;
}

type SortOrder = "atoz" | "ztoa" | "newest" | "oldest";
type ViewMode = "compact" | "expanded";

export const CardsArea: React.FC<CardsAreaProps> = ({ actor }) => {
  const allCards = actor.items.filter((item) => isCardItem(item));
  const categories = settings.cardCategories.get();
  const [category, setCategory] = React.useState<string | undefined>(undefined);
  const [sortOrder, setSortOrder] = React.useState<SortOrder>("newest");
  const [viewMode, setViewMode] = React.useState<ViewMode>("compact");

  const filteredCards = allCards.filter((card) => {
    if (category !== undefined) {
      return card.system.category === category;
    }
    return true;
  });

  let cards =
    sortOrder === "atoz" || sortOrder === "ztoa"
      ? sortEntitiesByName(filteredCards)
      : filteredCards;

  if (sortOrder === "newest" || sortOrder === "ztoa") {
    cards = cards.reverse();
  }

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
            setCategory(e.currentTarget.value);
          }}
        >
          <option value={undefined}>{getTranslated("All")}</option>
          {Object.entries(categories).map(([id, cat]) => (
            <option key={id} value={id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* sort order */}
        <select
          value={sortOrder}
          onChange={(e) => {
            setSortOrder(e.currentTarget.value as SortOrder);
          }}
        >
          <option value="newest">{getTranslated("Newest")}</option>
          <option value="oldest">{getTranslated("Oldest")}</option>
          <option value="atoz">{"A — Z"}</option>
          <option value="ztoa">{"Z — A"}</option>
        </select>

        {/* view mode */}
        <select
          value={viewMode}
          onChange={(e) => {
            setViewMode(e.currentTarget.value as ViewMode);
          }}
        >
          <option value="compact">{getTranslated("Compact")}</option>
          <option value="expanded">{getTranslated("Expanded")}</option>
        </select>
      </div>
      <div
        css={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gridAutoRows: "auto",
          columnGap: "0.5em",
          rowGap: "0.5em",
        }}
      >
        {cards.map((card) => (
          <CardDisplay key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
};
