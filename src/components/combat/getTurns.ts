import { isActiveCharacterActor } from "../../v10Types";

export interface InvestigatorTurn
  extends Omit<CombatTracker.Turn, "ressource" | "css"> {
  passingTurnsRemaining: number;
  totalPassingTurns: number;
  resource: CombatTracker.Turn["ressource"];
}

// adapted from foundry's CombatTracker, so there's some mutable data and
// weird imperative stuff
export function getTurns(combat: Combat) {
  const turns: InvestigatorTurn[] = [];
  let hasDecimals = false;

  for (const [i, combatant] of combat.turns.entries()) {
    if (!combatant.visible || combatant.id === null) {
      continue;
    }

    // Prepare turn data
    const resource =
      combatant.permission >= CONST.DOCUMENT_PERMISSION_LEVELS.OBSERVER
        ? combatant.resource
        : null;

    const active = i === combat.turn;
    const hidden = combatant.hidden;
    // @ts-expect-error combatant.defeated not in types yet
    let defeated = combatant.defeated;
    const owner = combatant.isOwner;
    const initiative = combatant.initiative;
    const hasRolled = combatant.initiative !== null;
    const hasResource = resource !== null;
    hasDecimals ||= initiative !== null && !Number.isInteger(initiative);

    let img = combatant.img;
    // Cached thumbnail image for video tokens
    if (VideoHelper.hasVideoExtension(img)) {
      // @ts-expect-error combatant._thumb is a thing
      if (combatant._thumb) img = combatant._thumb;
      else {
        // @ts-expect-error game.video is a thing
        game.video
          .createThumbnail(combatant.img, { width: 100, height: 100 })
          .then((img: string) => {
            // @ts-expect-error combatant._thumb is a thing
            img = combatant._thumb = img;
          });
      }
    }

    // Actor and Token status effects
    const effects = new Set<string>();
    if (combatant.token) {
      // @ts-expect-error v10 types
      combatant.token.effects.forEach((e) => effects.add(e));
      // @ts-expect-error v10 types
      if (combatant.token.overlayEffect)
        // @ts-expect-error v10 types
        effects.add(combatant.token.overlayEffect);
    }
    if (combatant.actor) {
      combatant.actor.temporaryEffects.forEach((e) => {
        // @ts-expect-error v11 types
        const statuses = e.statuses as Set<string>;

        // @ts-expect-error v11 types
        if (statuses.has(CONFIG.specialStatusEffects.DEFEATED)) {
          defeated = true;
        }
        // @ts-expect-error v10 types
        else if (e.icon) {
          // @ts-expect-error v10 types
          effects.add(e.icon);
        }
      });
    }

    const totalPassingTurns = isActiveCharacterActor(combatant.actor)
      ? combatant.actor?.system.initiativePassingTurns ?? 1
      : 1;

    const turn: InvestigatorTurn = {
      id: combatant.id,
      name: combatant.name,
      img,
      active,
      owner,
      defeated,
      hidden,
      initiative,
      hasRolled,
      hasResource,
      resource,
      effects,
      passingTurnsRemaining: combatant.passingTurnsRemaining,
      totalPassingTurns,
    };

    turns.push(turn);
  }
  const precision = CONFIG.Combat.initiative.decimals;
  turns.forEach((t) => {
    if (t.initiative !== null) {
      // @ts-expect-error it's fine. it's fine. it's fine. it's fine. it's fine.
      t.initiative = t.initiative.toFixed(hasDecimals ? precision : 0);
    }
  });

  return turns;
}
