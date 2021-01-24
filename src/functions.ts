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

export const sortEntitiesByName = <T extends Entity>(ents: T[]) => {
  return ents.sort(({ name: a }, { name: b }) => a < b ? -1 : a > b ? 1 : 0);
};

/**
 * Given an array (or nullish), a desired length, and a padding element, return
 * an array which is exactly the desired length by either padding or truncating
 * the original.
 */
export const fixLength = <T>(
  originalArray: T[] | null | undefined,
  desiredlength: number,
  paddingElement: T,
): T[] => {
  const paddingSize = Math.max(0, desiredlength - (originalArray?.length ?? 0));
  const result = [
    ...(originalArray || []),
    ...new Array(paddingSize).fill(paddingElement),
  ].slice(0, desiredlength);
  return result;
};
