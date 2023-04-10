import { AbilityType } from "../../types";
import { AbilityItem } from "../../v10Types";

export const typeHeaderKey = "typeHeader" as const;
export const categoryHeaderKey = "categoryHeader" as const;
export const abilityRowKey = "abilityRowString" as const;
export type TypeHeaderData = {
  rowType: typeof typeHeaderKey;
  abilityType: AbilityType;
};
export type CategoryHeaderData = {
  rowType: typeof categoryHeaderKey;
  category: string;
};
export type ActorAbilityInfo = {
  actorId: string;
  abilityId: string | undefined;
  rating: number | undefined;
};
export type AbilityRowData = {
  rowType: typeof abilityRowKey;
  abilityItem: AbilityItem;
  actorInfo: {
    [actorId: string]: ActorAbilityInfo;
  };
  total: number;
};
export type RowData = TypeHeaderData | CategoryHeaderData | AbilityRowData;
export const isTypeHeader = (data: RowData): data is TypeHeaderData =>
  data.rowType === typeHeaderKey;
export const isCategoryHeader = (data: RowData): data is CategoryHeaderData =>
  data.rowType === categoryHeaderKey;
