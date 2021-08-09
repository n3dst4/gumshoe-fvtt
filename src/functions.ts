import { generalAbility, investigativeAbility } from "./constants";
import { InvestigativeAbilityDataSourceData } from "./types";

export const isInvestigativeAbility = (item: Item) => (
  (typeof item === "string")
    ? item === investigativeAbility
    : item?.type === investigativeAbility
);

export const isGeneralAbility = (item: Item) => (
  (typeof item === "string")
    ? item === generalAbility
    : item?.type === generalAbility
);

export const isAbility = (item: Item) => (
  isInvestigativeAbility(item) || isGeneralAbility(item)
);

interface NameHaver {
  name: string|null;
}

export const sortEntitiesByName = <T extends NameHaver>(ents: T[]) => {
  return ents.sort((a, b) => {
    const aName = a.name || "";
    const bName = b.name || "";
    return aName < bName ? -1 : aName > bName ? 1 : 0;
  });
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

/**
 * Check that `game` has been initialised
 */
export function assertGame (game: any): asserts game is Game {
  if (!(game instanceof Game)) {
    throw new Error("game used before init hook");
  }
}

export function assertInvestigativeAbility ({ data }: Item): asserts data is InvestigativeAbilityDataSourceData {

}
