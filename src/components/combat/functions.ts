import { ConfiguredDocumentClass } from "@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { isActiveCharacterDataSource, isGeneralAbilityDataSource } from "../../types";
import * as constants from "../../constants";

export const compareCombatantsPassing = (active: string|null) => (
  a: InstanceType<ConfiguredDocumentClass<typeof Combatant>>,
  b: InstanceType<ConfiguredDocumentClass<typeof Combatant>>,
): number => {
  if (a.id === active) {
    return -1;
  } else if (b.id === active) {
    return 1;
  } else if (a.passingTurnsRemaining > b.passingTurnsRemaining) {
    return -1;
  } else if (a.passingTurnsRemaining < b.passingTurnsRemaining) {
    return 1;
  } else if (a.name < b.name) {
    return -1;
  } else if (a.name > b.name) {
    return 1;
  } else {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return a.id! > b.id! ? 1 : -1;
  }
};

export function compareCombatantsStandard (
  a: InstanceType<ConfiguredDocumentClass<typeof Combatant>>,
  b: InstanceType<ConfiguredDocumentClass<typeof Combatant>>,
): number {
  if (a.actor !== null && b.actor !== null && isActiveCharacterDataSource(a.actor?.data) && isActiveCharacterDataSource(b.actor?.data)) {
    const aAbilityName = a.actor.data.data.initiativeAbility;
    const aAbility = a.actor.items.find(
      (item: InvestigatorItem) => item.type === constants.generalAbility && item.name === aAbilityName,
    );
    const bAbilityName = b.actor.data.data.initiativeAbility;
    const bAbility = b.actor.items.find(
      (item: InvestigatorItem) => item.type === constants.generalAbility && item.name === bAbilityName,
    );
    // working out initiative - "goes first" beats non-"goes first"; then
    // compare ratings, then compare pools.
    if (aAbility !== undefined && bAbility !== undefined && isGeneralAbilityDataSource(aAbility.data) && isGeneralAbilityDataSource(bAbility.data)) {
      if (aAbility.data.data.goesFirstInCombat && !bAbility.data.data.goesFirstInCombat) {
        return -1;
      } else if (!aAbility.data.data.goesFirstInCombat && bAbility.data.data.goesFirstInCombat) {
        return 1;
      } else {
        const aRating = aAbility.data.data.rating;
        const bRating = bAbility.data.data.rating;
        const aPool = aAbility.data.data.pool;
        const bPool = bAbility.data.data.pool;
        if (aRating < bRating) {
          return 1;
        } else if (aRating > bRating) {
          return -1;
        } else if (aPool < bPool) {
          return 1;
        } else if (aPool > bPool) {
          return -1;
        }
      }
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return a.id! > b.id! ? 1 : -1;
}
