import { getNewPCPacks } from "../../settingsHelpers";
import { AbilityType, isAbilityDataSource } from "../../types";
import { abilityRowkey, AbilityTuple, ActorAbilityInfo, categoryHeaderKey, RowData, typeHeaderKey } from "./types";
import * as constants from "../../constants";
import { GumshoeActor } from "../../module/GumshoeActor";
import { assertGame } from "../../functions";

/**
 * get a sorted list of ability tuples
 * this is an intermediate stage - it will need to be built up into row data
 * with infor from actors
 */
export const getSystemAbilities = async (): Promise<AbilityTuple[]> => {
  const proms = getNewPCPacks().map(async (packId) => {
    assertGame(game);
    // getting pack content is slow
    const content = await game.packs.find((p: any) => p.collection === packId)?.getDocuments();
    const tuples: AbilityTuple[] = (content || [])
      .filter((x) => isAbilityDataSource(x.data))
      .map((i: any) => [
        i.data.type,
        i.data.data.category,
        i.data.name,
      ]);
    return tuples;
  });
  const results = await Promise.all(proms);
  return results.flat();
};

/**
 * ordering fn for ability types - inv first, then gen
 */
const compareTypes = (a: AbilityType, b: AbilityType) =>
  a === constants.investigativeAbility && b === constants.generalAbility
    ? -1
    : a === constants.generalAbility && b === constants.investigativeAbility
      ? +1
      : 0;

/**
 * case-insensitive string ordering fn
 */
const compareStrings = (a = "", b = ""): -1|0|1 => {
  const a_ = a.toLowerCase();
  const b_ = b.toLowerCase();
  return a_ < b_ ? -1 : a_ > b_ ? +1 : 0;
};

/**
 * ordering function for ability tuples
 */
const compareTuples = (
  [aType, aCategory, aName]: AbilityTuple,
  [bType, bCategory, bName]: AbilityTuple,
): -1|0|1 => {
  const typeComparison = compareTypes(aType, bType);
  if (typeComparison !== 0) {
    return typeComparison;
  }
  const categoryComparison = compareStrings(aCategory, bCategory);
  if (categoryComparison !== 0) {
    return categoryComparison;
  }
  const nameComparison = compareStrings(aName, bName);
  return nameComparison;
};

/**
 * given a list of ability tuples and a list of actors, build up the row data
 * we need to render the party sheet
 */
export const buildRowData = (
  tuples: AbilityTuple[],
  actors: GumshoeActor[],
): RowData[] => {
  const result: RowData[] = [];

  const sorted = tuples.sort(compareTuples);

  let lastType: AbilityType | null = null;
  let lastCategory: string | null = null;

  for (const [abilityType, category, name] of sorted) {
    if (abilityType !== lastType) {
      result.push({ rowType: typeHeaderKey, abilityType });
      lastType = abilityType;
      lastCategory = null;
    }
    if (category !== lastCategory) {
      result.push({ rowType: categoryHeaderKey, category });
      lastCategory = category;
    }
    const actorInfo: { [actorId: string]: ActorAbilityInfo } = {};
    let total = 0;

    for (const actor of actors) {
      if (actor === undefined) {
        continue;
      }
      const ability = actor.getAbilityByName(name, abilityType);
      if (ability !== undefined && actor.id !== null && ability.id !== null) {
        const rating = ability.getRating();
        actorInfo[actor.id] = {
          abilityId: ability.id,
          actorId: actor.id,
          rating,
        };
        total += rating;
      }
    }

    result.push({
      rowType: abilityRowkey,
      name,
      abilityType,
      actorInfo,
      total,
    });
  }
  return result;
};
