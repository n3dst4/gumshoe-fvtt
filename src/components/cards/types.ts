export type CardsSortOrder = "atoz" | "ztoa" | "newest" | "oldest";
export type CardsViewMode = "short" | "full";
export type CardsColumnWidth = "narrow" | "wide" | "full";

export type CardsAreaSettings = {
  category: string;
  sortOrder: CardsSortOrder;
  viewMode: CardsViewMode;
  columnWidth: CardsColumnWidth;
};
