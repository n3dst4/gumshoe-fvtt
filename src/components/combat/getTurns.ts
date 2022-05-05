export function getTurns (combat: Combat) {
  const turns: CombatTracker.Turn[] = [];
  let hasDecimals = false;

  for (const [i, combatant] of combat.turns.entries()) {
    if (!combatant.visible) continue;

    // Prepare turn data
    const resource = combatant.permission >= CONST.DOCUMENT_PERMISSION_LEVELS.OBSERVER ? combatant.resource : null;

    if (combatant.id === null) {
      continue;
    }

    const turn: CombatTracker.Turn = {
      id: combatant.id,
      name: combatant.name,
      img: combatant.img,
      active: i === combat.turn,
      owner: combatant.isOwner,
      defeated: combatant.data.defeated,
      hidden: combatant.hidden,
      initiative: combatant.initiative,
      hasRolled: combatant.initiative !== null,
      hasResource: resource !== null,
      // @ts-expect-error "resource" is correct
      resource: resource,
    };
    if ((turn.initiative !== null) && !Number.isInteger(turn.initiative)) hasDecimals = true;
    turn.css = [
      turn.active ? "active" : "",
      turn.hidden ? "hidden" : "",
      turn.defeated ? "defeated" : "",
    ].join(" ").trim();

    // Cached thumbnail image for video tokens
    if (VideoHelper.hasVideoExtension(turn.img)) {
      // @ts-expect-error combatant._thumb is a thing
      if (combatant._thumb) turn.img = combatant._thumb;
      // @ts-expect-error combatant._thumb is a thing
      else turn.img = combatant._thumb = await game.video.createThumbnail(combatant.img, { width: 100, height: 100 });
    }

    // Actor and Token status effects
    turn.effects = new Set();
    if (combatant.token) {
      combatant.token.data.effects.forEach(e => turn.effects.add(e));
      if (combatant.token.data.overlayEffect) turn.effects.add(combatant.token.data.overlayEffect);
    }
    if (combatant.actor) {
      combatant.actor.temporaryEffects.forEach(e => {
        if (e.getFlag("core", "statusId") === CONFIG.Combat.defeatedStatusId) turn.defeated = true;
        else if (e.data.icon) turn.effects.add(e.data.icon);
      });
    }
    turns.push(turn);
  }
  const precision = CONFIG.Combat.initiative.decimals;
  turns.forEach(t => {
    if (t.initiative !== null) {
      // @ts-expect-error it's fine. it's fine. it's fine. it's fine. it's fine.
      t.initiative = t.initiative.toFixed(hasDecimals ? precision : 0);
    }
  });

  return turns;
}
