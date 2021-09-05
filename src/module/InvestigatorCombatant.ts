import * as constants from "../constants";
import { GumshoeItem } from "./GumshoeItem";

export class InvestigatorCombatant extends Combatant {
  _getInitiativeFormula () {
    // we can do combatant.actor to get the actor
    if (this.actor?.data.type !== constants.pc) {
      return "0";
    }
    const abilityName = this.actor?.data.data.initiativeAbility;
    const ability = this.actor.items.find(
      (item: GumshoeItem) => item.type === constants.generalAbility && item.name === abilityName,
    );
    if (ability && ability.data.type === constants.generalAbility) {
      return ability.data.data.rating.toString();
    } else {
      return "0";
    }
  }
}
