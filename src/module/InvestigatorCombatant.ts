import * as constants from "../constants";
import { InvestigatorItem } from "./InvestigatorItem";
import { assertActiveCharacterDataSource } from "../types";
import { isNullOrEmptyString } from "../functions";
import { settings } from "../startup/registerSettings";
/**
 * Override base Combatant class to override the initiative formula.
 * XXX what i'd like to do is block it from doing a "roll" at all.
 */
export class InvestigatorCombatant extends Combatant {
  _getInitiativeFormula () {
    assertActiveCharacterDataSource(this.actor?.data);
    // get the ability name, and if not set, use the first one on the system
    // config (we had a bug where some chars were getting created without an
    // init ability name)
    const abilityName = this.actor?.data.data.initiativeAbility || settings.combatAbilities.get().sort()[0] || "";
    // and if it was null, set it on the actor now.
    if (this.actor && isNullOrEmptyString(this.actor.data.data.initiativeAbility)) {
      this.actor.update({ data: { initiativeAbility: abilityName } });
    }
    const ability = this.actor.items.find(
      (item: InvestigatorItem) => item.type === constants.generalAbility && item.name === abilityName,
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
