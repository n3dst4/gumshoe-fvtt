import * as constants from "../constants";
import { InvestigatorItem } from "./InvestigatorItem";
import { assertActiveCharacterDataSource } from "../types";
import { isNullOrEmptyString } from "../functions";
import { settings } from "../settings";

const log = console.log.bind(console, "[InvestigatorCombatant] ");

/**
 * Override base Combatant class to override the initiative formula.
 * XXX what i'd like to do is block it from doing a "roll" at all.
 */
export class InvestigatorCombatant extends Combatant {
  constructor (
    data: ConstructorParameters<typeof foundry.documents.BaseCombatant>[0],
    context: ConstructorParameters<typeof foundry.documents.BaseCombatant>[1],
  ) {
    // yeah yeah, commented code is bad, whatever. i just wanted to leave you an
    // example of how to construct this object with the right initiative in one
    // go rather than having to do an async update afterwards. this way, there's
    // no unsightly flash of "not-yet-rolled-initiative" when adding a
    // combatant. however i think we can all agree that it's fugly as fug.

    // assertGame(game);
    // const scene = (data?.sceneId) ? game.scenes?.get(data.sceneId as string) : context?.parent?.scene;
    // const token = data?.tokenId ? scene?.tokens.get(data?.tokenId as string) : null;
    // const actor = (token) ? token.actor : (data?.actorId) ? game.actors?.get(data?.actorId as string) : null;
    // const initiative = (actor) ? InvestigatorCombatant.getGumshoeInitiative(actor) : 0;
    // const newData: typeof data = {
    //   ...data,
    //   initiative,
    // };
    // super(newData, context);

    super(data, context);
    log("constructing combatant", { data, context, this: this });
    if (this.data._id && this.data.initiative === undefined) {
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
