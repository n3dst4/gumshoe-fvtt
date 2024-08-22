import React, { useCallback, useEffect, useState } from "react";

import { getTranslated } from "../../functions/getTranslated";
import { sortEntitiesByName } from "../../functions/utilities";
import { InvestigatorActor } from "../../module/InvestigatorActor";
import { settings } from "../../settings/settings";
import { assertPCActor, isCardItem } from "../../v10Types";
import { absoluteCover } from "../absoluteCover";
import { Button } from "../inputs/Button";
import { CardArray } from "./CardArray";
import { CategorizedCards } from "./CategorizedCards";
import { CardsAreaSettingsContext } from "./contexts";
import {
  CardsAreaSettings,
  CardsCategoryMode,
  CardsColumnWidth,
  CardsSortOrder,
  CardsViewMode,
} from "./types";

interface CardsAreaProps {
  actor: InvestigatorActor;
}

export const CardsArea: React.FC<CardsAreaProps> = ({ actor }) => {
  assertPCActor(actor);
  const allCards = actor.items.filter((item) => isCardItem(item));
  const categories = settings.cardCategories.get();

  // local settings state for rapid updates
  const [cardsAreaSettings, setCardsAreaSettings] = useState<CardsAreaSettings>(
    actor.system.cardsAreaSettings,
  );

  // keep local state in sync with the actor
  useEffect(() => {
    void setCardsAreaSettings({
      category: actor.system.cardsAreaSettings.category,
      sortOrder: actor.system.cardsAreaSettings.sortOrder,
      viewMode: actor.system.cardsAreaSettings.viewMode,
      columnWidth: actor.system.cardsAreaSettings.columnWidth,
    });
  }, [
    actor.system.cardsAreaSettings.category,
    actor.system.cardsAreaSettings.sortOrder,
    actor.system.cardsAreaSettings.viewMode,
    actor.system.cardsAreaSettings.columnWidth,
  ]);

  // update local state and the actor
  const updateCardsAreaSettings = useCallback(
    (update: Partial<CardsAreaSettings>) => {
      setCardsAreaSettings((current: CardsAreaSettings) => {
        const newSettings = {
          ...current,
          ...update,
        };
        // update the actor in the background
        void actor.setCardsAreaSettings(newSettings);
        return newSettings;
      });
    },
    [actor],
  );

  const handleClickCreateCard = useCallback(() => {
    void actor.createCard();
  }, [actor]);

  let cards =
    cardsAreaSettings.sortOrder === "atoz" ||
    cardsAreaSettings.sortOrder === "ztoa"
      ? sortEntitiesByName(allCards)
      : allCards;

  if (
    cardsAreaSettings.sortOrder === "newest" ||
    cardsAreaSettings.sortOrder === "ztoa"
  ) {
    cards = cards.reverse();
  }

  const containerRef = React.useRef<HTMLDivElement>(null);

  return (
    <CardsAreaSettingsContext.Provider value={cardsAreaSettings}>
      <div
        css={{
          ...absoluteCover,
          display: "flex",
          flexDirection: "column",
          padding: "0.5em",
        }}
      >
        <div
          css={{
            display: "flex",
            flexDirection: "row",
            gap: "0.5em",
          }}
        >
          {/* category */}
          {categories.length > 1 && (
            <select
              value={cardsAreaSettings.category}
              onChange={(e) => {
                updateCardsAreaSettings({
                  category: e.currentTarget.value as CardsCategoryMode,
                });
              }}
            >
              <option value="all">{getTranslated("All")}</option>
              <option value="categorized">
                {getTranslated("Categorized")}
              </option>
            </select>
          )}
          {/* sort order */}
          <select
            value={cardsAreaSettings.sortOrder}
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
          </select>
          {/* view mode */}
          <select
            value={cardsAreaSettings.viewMode}
            onChange={(e) => {
              updateCardsAreaSettings({
                viewMode: e.currentTarget.value as CardsViewMode,
              });
            }}
          >
            <option value="short">{getTranslated("Short")}</option>
            <option value="full">{getTranslated("Full")}</option>
          </select>
          {/* column width */}
          <select
            value={cardsAreaSettings.columnWidth}
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
          <div css={{ flex: 1 }} />
          <Button onClick={handleClickCreateCard}>
            {getTranslated("Create card")}
          </Button>
        </div>
        <div
          className="container-ref-haver"
          ref={containerRef}
          css={{
            flex: 1,
            overflow: "auto",
          }}
        >
          {cardsAreaSettings.category === "categorized" ? (
            <CategorizedCards cards={cards} />
          ) : (
            <CardArray cards={cards} />
          )}
        </div>
      </div>
    </CardsAreaSettingsContext.Provider>
  );
};
