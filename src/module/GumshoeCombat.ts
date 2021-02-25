import { generalAbility } from "../constants";
import { GumshoeItem } from "./GumshoeItem";

/**
 * Override the standard Combat class
 */
export class GumshoeCombat extends Combat {
  _getInitiativeFormula (combatant: any) {
    // we can do combatant.actor to get the actor
    const abilityName = combatant.actor.data.data.initiativeAbility;
    const ability = combatant.actor.items.find(
      (item: GumshoeItem) => item.type === generalAbility && item.name === abilityName,
    );
    if (ability) {
      return ability.data.data.rating.toString();
    } else {
      return "0";
    }
  }
}
