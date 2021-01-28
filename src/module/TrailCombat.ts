/**
 * Override the standard Combat class
 */
export class TrailCombat extends Combat {
  _getInitiativeFormula (combatant) {
    // we can do combatant.actor to get the actor
    return "3d6";
  }
}
