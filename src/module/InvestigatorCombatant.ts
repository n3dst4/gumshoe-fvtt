import * as constants from "../constants";
import { InvestigatorItem } from "./InvestigatorItem";
import { assertGame, isNullOrEmptyString, systemLogger } from "../functions";
import { settings } from "../settings";
import {
  // assertActiveCharacterActor,
  isActiveCharacterActor,
  isGeneralAbilityItem,
} from "../v10Types";

type JumpInBeforeIds = Readonly<Record<number, string>>;

/**
 * Override base Combatant class to override the initiative formula.
 */
export class InvestigatorCombatant extends Combatant {
  get gumshoeInitiative() {
    const actor = this.actor;
    if (!isActiveCharacterActor(actor)) {
      return 0;
    }
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
    return this.gumshoeInitiative.toString();
  }

  /**
   * Update the initiative for this combatant.
   *
   * Feels like there ought to be a built-in way of doing this, but I can't find
   * it.
   */
  doGumshoeInitiative = () => {
    // @ts-expect-error v10 types
    if (this._id) {
      this.update({
        initiative: this.gumshoeInitiative,
      });
    } else {
      systemLogger.error("doGumshoeInitiative - no _id");
    }
  };

  // ---------------------------------------------------------------------------
  // TURN PASSING
  // ---------------------------------------------------------------------------
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

  get passingTurnsRemaining(): number {
    const maxPassingTurns =
      this.actor && isActiveCharacterActor(this.actor)
        ? this.actor?.system.initiativePassingTurns
        : 1;
    const tagValue = this.getFlag(
      constants.systemId,
      constants.passingTurnsRemaining,
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
      this.setFlag(constants.systemId, constants.passingTurnsRemaining, turns);
    }
  }

  get jumpInBeforeIds(): JumpInBeforeIds {
    return (this.getFlag(constants.systemId, constants.jumpInitiative) ??
      {}) as Record<number, string>;
  }

  set jumpInBeforeIds(jumpInBeforeIds: JumpInBeforeIds) {
    assertGame(game);
    if (game.user && this.canUserModify(game.user, "update")) {
      this.setFlag(
        constants.systemId,
        constants.jumpInitiative,
        jumpInBeforeIds,
      );
    }
  }

  /**
   * Cause the combatant to jump in before the active combatant.
   *
   * This should only be called via the hook handler, on the GM's client.
   */
  jumpIn() {
    assertGame(game);
    if (!game.user?.isGM) {
      systemLogger.error("Cannot jump in - not GM");
      return;
    }
    // bail out if not in combat
    if (!this.combat) {
      systemLogger.log("jumpInInitiative - not in combat");
      return;
    }
    const combat = this.combat;

    // bail out if the combatant has already gone this round
    const thisIndex = combat.turns.findIndex((turn) => turn.id === this.id);
    if (thisIndex <= (combat.turn ?? 0)) {
      systemLogger.error("jumpInInitiative - combatant already gone");
      return;
    }
    const activeCombatantId = combat.turns[combat.turn ?? 0].id;

    if (!activeCombatantId) {
      systemLogger.error("jumpInInitiative - no active combatant");
      return;
    }

    const jumpInBeforeIds: JumpInBeforeIds = {
      ...this.jumpInBeforeIds,
      [combat.round ?? 0]: activeCombatantId,
    };
    this.jumpInBeforeIds = jumpInBeforeIds;
  }
}

declare global {
  interface DocumentClassConfig {
    Combatant: typeof InvestigatorCombatant;
  }
}
