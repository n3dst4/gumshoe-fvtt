/**
 * Override the standard Combat class
 */
export class TrailCombat extends Combat {
  _getInitiativeFormula (combatant) {
    return "3d6";
  }
}
