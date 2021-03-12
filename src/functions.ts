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

export const sortEntitiesByName = <T extends Entity|EntityData>(ents: T[]) => {
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

export const mapValues = <V1, V2>(
  mapper: (v: V1) => V2,
  subject: {[k: string]: V1},
): {[k: string]: V2} => {
  const result: {[k: string]: V2} = {};
  for (const k in subject) {
    result[k] = mapper(subject[k]);
  }
  return result;
};

export const isNullOrEmptyString = (x: any) => {
  return x === null || x === undefined || x === "";
};

// Folder type is a bit fucky rn
export const getFolderDescendants = <T extends Entity>(folder: any): T[] => {
  return [...folder.children.flatMap(getFolderDescendants), ...folder.content];
};

// version of Object.prototype.hasOwnProperty that's safe even when prototype
// has been overridden
export const hasOwnProperty = (x: any, y: string) =>
  Object.prototype.hasOwnProperty.call(x, y);
