import * as constants from "../constants";
import { GumshoeItem } from "./GumshoeItem";
import { assertActiveCharacterDataSource } from "../types";
/**
 * Override base Combatant class to override the initiative formula.
 * XXX what's i'd like to do is block it from doing a "roll" at all.
 */
export class InvestigatorCombatant extends Combatant {
  _getInitiativeFormula () {
    assertActiveCharacterDataSource(this.actor?.data);
    const abilityName = this.actor?.data.data.initiativeAbility;
    const ability = this.actor.items.find(
      (item: GumshoeItem) => item.type === constants.generalAbility && item.name === abilityName,
    );
    if (ability && ability.data.type === constants.generalAbility) {
      const score = ability.data.data.rating.toString();
      return score;
    } else {
      return "0";
    }
  }
}

declare global {
  interface DocumentClassConfig {
    Combatant: typeof InvestigatorCombatant;
  }
}
