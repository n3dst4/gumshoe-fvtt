import { ConfiguredDocumentClass } from "@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes";
import {
  compareCombatantsPassing,
  compareCombatantsStandard,
} from "../components/combat/functions";
import * as constants from "../constants";
import { settings } from "../settings";
import { isActiveCharacterActor } from "../v10Types";

/**
 * Override base Combat so we can do custom GUMSHOE-style initiative
 */
export class InvestigatorCombat extends Combat {
  override _onCreate(
    data: this["data"]["_source"],
    options: any,
    userId: string,
  ) {
    super._onCreate(data, options, userId);
    if (settings.useTurnPassingInitiative.get()) {
      this.update({
        round: 1,
      });
    }
  }

  override get started() {
    return true;
  }

  protected override _sortCombatants = (
    a: InstanceType<ConfiguredDocumentClass<typeof Combatant>>,
    b: InstanceType<ConfiguredDocumentClass<typeof Combatant>>,
  ): number => {
    if (settings.useTurnPassingInitiative.get()) {
      return compareCombatantsPassing(this.activeTurnPassingCombatant)(a, b);
    } else {
      return compareCombatantsStandard(a, b);
    }
  };

  override async nextRound() {
    this.turns.forEach((combatant) => {
      const actor = combatant.actor;
      const max =
        actor !== null && isActiveCharacterActor(actor)
          ? actor.system.initiativePassingTurns
          : 1;
      combatant.passingTurnsRemaining = max;
    });
    this.activeTurnPassingCombatant = null;
    return super.nextRound();
  }

  get activeTurnPassingCombatant() {
    return this.getFlag(constants.systemId, "activeTurnPassingCombatant") as
      | string
      | null;
  }

  set activeTurnPassingCombatant(id: string | null) {
    this.setFlag(constants.systemId, "activeTurnPassingCombatant", id);
  }
}

declare global {
  interface DocumentClassConfig {
    Combat: typeof InvestigatorCombat;
  }
}
