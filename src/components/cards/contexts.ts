import { createContext } from "react";

import { CardsAreaSettings } from "./types";

type CardsAreaSettingsContextData = {
  cardsAreaSettings: CardsAreaSettings;
  updateCardsAreaSettings: (settings: Partial<CardsAreaSettings>) => void;
};

export const CardsAreaSettingsContext =
  createContext<CardsAreaSettingsContextData>({
    cardsAreaSettings: {
      category: "all",
      sortOrder: "newest",
      viewMode: "short",
      columnWidth: "narrow",
    },
    updateCardsAreaSettings: () => {
      throw new Error("setSettings used outside of context");
    },
  });
