import * as constants from "../constants";
import { InvestigatorItem } from "./InvestigatorItem";
import { assertActiveCharacterDataSource } from "../types";
import { isNullOrEmptyString } from "../functions";
import { settings } from "../settings";

/**
 * Override base Combatant class to override the initiative formula.
 */
export class InvestigatorCombatant extends Combatant {
  doGumshoeInitiative = () => {
    if (this.data._id) {
      const initiative = this.actor
        ? InvestigatorCombatant.getGumshoeInitiative(this.actor)
        : 0;
      this.update({ initiative });
    }
  }

  static getGumshoeInitiative (actor: Actor) {
    assertActiveCharacterDataSource(actor?.data);
    // get the ability name, and if not set, use the first one on the system
    // config (we had a bug where some chars were getting created without an
    // init ability name)
    const abilityName = actor?.data.data.initiativeAbility || settings.combatAbilities.get().sort()[0] || "";
    // and if it was null, set it on the actor now.
    if (actor && isNullOrEmptyString(actor.data.data.initiativeAbility)) {
      actor.update({ data: { initiativeAbility: abilityName } });
    }
    const ability = actor.items.find(
      (item: InvestigatorItem) => item.type === constants.generalAbility && item.name === abilityName,
    );
    if (ability && ability.data.type === constants.generalAbility) {
      const score = ability.data.data.rating;
      return score;
    } else {
      return 0;
    }
  }

  _getInitiativeFormula () {
    return this.actor ? InvestigatorCombatant.getGumshoeInitiative(this.actor).toString() : "0";
  }
}

declare global {
  interface DocumentClassConfig {
    Combatant: typeof InvestigatorCombatant;
  }
}
