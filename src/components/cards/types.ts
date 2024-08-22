export type CardsSortOrder = "atoz" | "ztoa" | "newest" | "oldest";
export type CardsViewMode = "short" | "full";
export type CardsColumnWidth = "narrow" | "wide" | "full";
export type CardsCategoryMode = "all" | "categorized";

export type CardsAreaSettings = {
  category: CardsCategoryMode;
  sortOrder: CardsSortOrder;
  viewMode: CardsViewMode;
  columnWidth: CardsColumnWidth;
};
