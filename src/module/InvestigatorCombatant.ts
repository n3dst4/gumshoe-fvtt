import * as constants from "../constants";
import { InvestigatorItem } from "./InvestigatorItem";
import {
  assertActiveCharacterDataSource,
  isActiveCharacterDataSource,
} from "../typeAssertions";
import { assertGame, isNullOrEmptyString } from "../functions";
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
  };

  resetPassingTurns() {
    this.passingTurnsRemaining = isActiveCharacterDataSource(this.actor?.data)
      ? this.actor?.data.data.initiativePassingTurns ?? 1
      : 1;
  }

  addPassingTurn() {
    this.passingTurnsRemaining += 1;
  }

  removePassingTurn() {
    this.passingTurnsRemaining = Math.max(0, this.passingTurnsRemaining - 1);
  }

  static getGumshoeInitiative(actor: Actor) {
    assertActiveCharacterDataSource(actor?.data);
    // get the ability name, and if not set, use the first one on the system
    // config (we had a bug where some chars were getting created without an
    // init ability name)
    const abilityName =
      actor?.data.data.initiativeAbility ||
      settings.combatAbilities.get().sort()[0] ||
      "";
    // and if it was null, set it on the actor now.
    if (actor && isNullOrEmptyString(actor.data.data.initiativeAbility)) {
      actor.update({ data: { initiativeAbility: abilityName } });
    }
    const ability = actor.items.find(
      (item: InvestigatorItem) =>
        item.type === constants.generalAbility && item.name === abilityName,
    );
    if (ability && ability.data.type === constants.generalAbility) {
      const score = ability.data.data.rating;
      return score;
    } else {
      return 0;
    }
  }

  _getInitiativeFormula() {
    return this.actor
      ? InvestigatorCombatant.getGumshoeInitiative(this.actor).toString()
      : "0";
  }

  get passingTurnsRemaining(): number {
    const maxPassingTurns =
      this.actor && isActiveCharacterDataSource(this.actor?.data)
        ? this.actor?.data.data.initiativePassingTurns
        : 1;
    const tagValue = this.getFlag(
      constants.systemName,
      "passingTurnsRemaining",
    );
    if (tagValue === undefined) {
      this.passingTurnsRemaining = maxPassingTurns;
      return maxPassingTurns;
    }
    return Number(tagValue);
  }

  set passingTurnsRemaining(turns: number) {
    assertGame(game);
    if (game.user && this.canUserModify(game.user, "update")) {
      this.setFlag(constants.systemName, "passingTurnsRemaining", turns);
    }
  }
}

declare global {
  interface DocumentClassConfig {
    Combatant: typeof InvestigatorCombatant;
  }
}
