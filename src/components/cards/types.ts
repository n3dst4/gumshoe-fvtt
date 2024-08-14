export type CardsSortOrder = "atoz" | "ztoa" | "newest" | "oldest";
export type CardsViewMode = "compact" | "expanded";
export type CardsColumnWidth = "narrow" | "wide" | "full";

export type CardsAreaSettings = {
  category: string;
  sortOrder: CardsSortOrder;
  viewMode: CardsViewMode;
  columnWidth: CardsColumnWidth;
};
