import { createContext } from "react";

import { CardsAreaSettings } from "./types";

type CardsAreaSettingsContextData = {
  cardsAreaSettings: CardsAreaSettings;
  updateCardsAreaSettings: (settings: Partial<CardsAreaSettings>) => void;
};

export const CardsAreaSettingsContext =
  createContext<CardsAreaSettingsContextData>({
    cardsAreaSettings: {
      category: "",
      sortOrder: "newest",
      viewMode: "compact",
    },
    updateCardsAreaSettings: () => {
      throw new Error("setSettings used outside of context");
    },
  });
