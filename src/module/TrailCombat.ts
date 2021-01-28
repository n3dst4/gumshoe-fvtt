import { generalAbility } from "../constants";

/**
 * Override the standard Combat class
 */
export class TrailCombat extends Combat {
  _getInitiativeFormula (combatant) {
    // we can do combatant.actor to get the actor
    const abilityName = combatant.actor.data.data.initiativeAbility;
    const ability = combatant.actor.items.find(
      (item) => item.type === generalAbility && item.name === abilityName,
    );
    if (ability) {
      return ability.data.data.rating;
    } else {
      return 0;
    }
  }
}
