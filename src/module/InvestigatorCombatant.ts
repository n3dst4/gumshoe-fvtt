import * as constants from "../constants";
import { InvestigatorItem } from "./InvestigatorItem";
import { assertGame, isNullOrEmptyString } from "../functions";
import { settings } from "../settings";
import {
  assertActiveCharacterActor,
  isActiveCharacterActor,
  isGeneralAbilityItem,
} from "../v10Types";

/**
 * Override base Combatant class to override the initiative formula.
 */
export class InvestigatorCombatant extends Combatant {
  doGumshoeInitiative = () => {
    // @ts-expect-error v10 types
    if (this._id) {
      const initiative = this.actor
        ? InvestigatorCombatant.getGumshoeInitiative(this.actor)
        : 0;
      this.update({ initiative });
    }
  };

  resetPassingTurns() {
    this.passingTurnsRemaining =
      this.actor && isActiveCharacterActor(this.actor)
        ? this.actor?.system.initiativePassingTurns ?? 1
        : 1;
  }

  addPassingTurn() {
    this.passingTurnsRemaining += 1;
  }

  removePassingTurn() {
    this.passingTurnsRemaining = Math.max(0, this.passingTurnsRemaining - 1);
  }

  static getGumshoeInitiative(actor: Actor) {
    assertActiveCharacterActor(actor);
    // get the ability name, and if not set, use the first one on the system
    // config (we had a bug where some chars were getting created without an
    // init ability name)
    const abilityName =
      actor?.system.initiativeAbility ||
      [...settings.combatAbilities.get()].sort()[0] ||
      "";
    // and if it was null, set it on the actor now.
    if (actor && isNullOrEmptyString(actor.system.initiativeAbility)) {
      actor.update({ system: { initiativeAbility: abilityName } });
    }
    const ability = actor.items.find(
      (item: InvestigatorItem) =>
        item.type === constants.generalAbility && item.name === abilityName,
    );
    if (ability && isGeneralAbilityItem(ability)) {
      const score = ability.system.rating;
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
      this.actor && isActiveCharacterActor(this.actor)
        ? this.actor?.system.initiativePassingTurns
        : 1;
    const tagValue = this.getFlag(constants.systemId, "passingTurnsRemaining");
    if (tagValue === undefined) {
      this.passingTurnsRemaining = maxPassingTurns;
      return maxPassingTurns;
    }
    return Number(tagValue);
  }

  set passingTurnsRemaining(turns: number) {
    assertGame(game);
    if (game.user && this.canUserModify(game.user, "update")) {
      this.setFlag(constants.systemId, "passingTurnsRemaining", turns);
    }
  }
}

declare global {
  interface DocumentClassConfig {
    Combatant: typeof InvestigatorCombatant;
  }
}
