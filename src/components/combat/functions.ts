import { ConfiguredDocumentClass } from "@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import * as constants from "../../constants";
import { isActiveCharacterActor, isGeneralAbilityItem } from "../../v10Types";

const compare = <T>(a: T, b: T) => (a < b ? -1 : a > b ? 1 : 0);
const compareInv = <T>(a: T, b: T) => compare(a, b) * -1;

export const compareCombatantsPassing =
  (active: string | null) =>
  (
    a: InstanceType<ConfiguredDocumentClass<typeof Combatant>>,
    b: InstanceType<ConfiguredDocumentClass<typeof Combatant>>,
  ): number => {
    return (
      compareInv(a.id === active, b.id === active) ||
      compareInv(a.passingTurnsRemaining, b.passingTurnsRemaining) ||
      compare(a.name, b.name) ||
      compare(a.id, b.id)
    );
  };

export function compareCombatantsStandard(
  a: InstanceType<ConfiguredDocumentClass<typeof Combatant>>,
  b: InstanceType<ConfiguredDocumentClass<typeof Combatant>>,
  turnNumber: number,
): number {
  if (
    a.actor !== null &&
    b.actor !== null &&
    isActiveCharacterActor(a.actor) &&
    isActiveCharacterActor(b.actor)
  ) {
    const aAbilityName = a.actor.system.initiativeAbility;
    const aAbility = a.actor.items.find(
      (item: InvestigatorItem) =>
        item.type === constants.generalAbility && item.name === aAbilityName,
    );
    const bAbilityName = b.actor.system.initiativeAbility;
    const bAbility = b.actor.items.find(
      (item: InvestigatorItem) =>
        item.type === constants.generalAbility && item.name === bAbilityName,
    );
    // working out initiative - "goes first" beats non-"goes first"; then
    // compare ratings, then compare pools.
    // debugger;

    if (
      aAbility !== undefined &&
      bAbility !== undefined &&
      isGeneralAbilityItem(aAbility) &&
      isGeneralAbilityItem(bAbility)
    ) {
      // debugger;
      const aJumpInBeforeId = a.jumpInBeforeIds[turnNumber];
      const bJumpInBeforeId = b.jumpInBeforeIds[turnNumber];
      if (aJumpInBeforeId) {
        const jumpInBeforeCombatant = a.combat?.combatants.get(aJumpInBeforeId);
        if (aJumpInBeforeId === b.id) {
          return -1;
        } else if (jumpInBeforeCombatant) {
          return compareCombatantsStandard(
            jumpInBeforeCombatant,
            b,
            turnNumber,
          );
        }
      }
      if (bJumpInBeforeId) {
        const jumpInBeforeCombatant = b.combat?.combatants.get(bJumpInBeforeId);
        if (bJumpInBeforeId === a.id) {
          return 1;
        } else if (jumpInBeforeCombatant) {
          return compareCombatantsStandard(
            a,
            jumpInBeforeCombatant,
            turnNumber,
          );
        }
      }

      if (
        aAbility.system.goesFirstInCombat &&
        !bAbility.system.goesFirstInCombat
      ) {
        return -1;
      } else if (
        !aAbility.system.goesFirstInCombat &&
        bAbility.system.goesFirstInCombat
      ) {
        return 1;
      } else {
        const aRating = aAbility.system.rating;
        const bRating = bAbility.system.rating;
        const aPool = aAbility.system.pool;
        const bPool = bAbility.system.pool;
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
