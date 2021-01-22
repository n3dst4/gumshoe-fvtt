import { generalAbility, investigativeAbility } from "./constants";

export const isInvestigativeAbility = (item: Item | string) => (
  (typeof item === "string")
    ? item === investigativeAbility
    : item?.type === investigativeAbility
);

export const isGeneralAbility = (item: Item | string) => (
  (typeof item === "string")
    ? item === generalAbility
    : item?.type === generalAbility
);

export const isAbility = (item: Item | string) => (
  isInvestigativeAbility(item) || isGeneralAbility(item)
);
