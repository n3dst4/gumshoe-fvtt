# Migration examples from 5e

Dumping these into a fenced block because they will f up my build otherwise

```js
/* -------------------------------------------- */
/*  Entity Type Migration Helpers               */
/* -------------------------------------------- */

/* -------------------------------------------- */

/**
 * Scrub an Actor's system data, removing all keys which are not explicitly defined in the system template
 * @param {Object} actorData    The data object for an Actor
 * @return {Object}             The scrubbed Actor data
 */
function cleanActorData (actorData) {
  // Scrub system data
  const model = game.system.model.Actor[actorData.type];
  actorData.data = filterObject(actorData.data, model);

  // Scrub system flags
  const allowedFlags = CONFIG.DND5E.allowedActorFlags.reduce((obj, f) => {
    obj[f] = null;
    return obj;
  }, {});
  if (actorData.flags.dnd5e) {
    actorData.flags.dnd5e = filterObject(actorData.flags.dnd5e, allowedFlags);
  }

  // Return the scrubbed data
  return actorData;
}

/* -------------------------------------------- */

/* -------------------------------------------- */

/* -------------------------------------------- */
/*  Low level migration utilities
/* -------------------------------------------- */

/**
 * Migrate the actor speed string to movement object
 * @private
 */
function _migrateActorMovement (actorData, updateData) {
  const ad = actorData.data;

  // Work is needed if old data is present
  const old = actorData.type === "vehicle" ? ad?.attributes?.speed : ad?.attributes?.speed?.value;
  const hasOld = old !== undefined;
  if (hasOld) {
    // If new data is not present, migrate the old data
    const hasNew = ad?.attributes?.movement?.walk !== undefined;
    if (!hasNew && (typeof old === "string")) {
      const s = (old || "").split(" ");
      if (s.length > 0) updateData["data.attributes.movement.walk"] = Number.isNumeric(s[0]) ? parseInt(s[0]) : null;
    }

    // Remove the old attribute
    updateData["data.attributes.-=speed"] = null;
  }
  return updateData;
}

/* -------------------------------------------- */

/**
 * Migrate the actor traits.senses string to attributes.senses object
 * @private
 */
function _migrateActorSenses (actor, updateData) {
  const ad = actor.data;
  if (ad?.traits?.senses === undefined) return;
  const original = ad.traits.senses || "";

  // Try to match old senses with the format like "Darkvision 60 ft, Blindsight 30 ft"
  const pattern = /([A-z]+)\s?([0-9]+)\s?([A-z]+)?/;
  let wasMatched = false;

  // Match each comma-separated term
  for (let s of original.split(",")) {
    s = s.trim();
    const match = s.match(pattern);
    if (!match) continue;
    const type = match[1].toLowerCase();
    if (type in CONFIG.DND5E.senses) {
      updateData[`data.attributes.senses.${type}`] = Number(match[2]).toNearest(0.5);
      wasMatched = true;
    }
  }

  // If nothing was matched, but there was an old string - put the whole thing in "special"
  if (!wasMatched && !!original) {
    updateData["data.attributes.senses.special"] = original;
  }

  // Remove the old traits.senses string once the migration is complete
  updateData["data.traits.-=senses"] = null;
  return updateData;
}

/* -------------------------------------------- */

/**
 * Delete the old data.attuned boolean
 * @private
 */
function _migrateItemAttunement (item, updateData) {
  if (item.data.attuned === undefined) return;
  updateData["data.attunement"] = CONFIG.DND5E.attunementTypes.NONE;
  updateData["data.-=attuned"] = null;
  return updateData;
}

/* -------------------------------------------- */

/**
 * A general tool to purge flags from all entities in a Compendium pack.
 * @param {Compendium} pack   The compendium pack to clean
 * @private
 */
export async function purgeFlags (pack) {
  const cleanFlags = (flags) => {
    const flags5e = flags.dnd5e || null;
    return flags5e ? { dnd5e: flags5e } : {};
  };
  await pack.configure({ locked: false });
  const content = await pack.getContent();
  for (const entity of content) {
    const update = { _id: entity.id, flags: cleanFlags(entity.data.flags) };
    if (pack.entity === "Actor") {
      update.items = entity.data.items.map(i => {
        i.flags = cleanFlags(i.flags);
        return i;
      });
    }
    await pack.updateEntity(update, { recursive: false });
    console.log(`Purged flags from ${entity.name}`);
  }
  await pack.configure({ locked: true });
}

/* -------------------------------------------- */

/**
 * Purge the data model of any inner objects which have been flagged as _deprecated.
 * @param {object} data   The data to clean
 * @private
 */
export function removeDeprecatedObjects (data) {
  for (const [k, v] of Object.entries(data)) {
    if (getType(v) === "Object") {
      if (v._deprecated === true) {
        console.log(`Deleting deprecated object key ${k}`);
        delete data[k];
      } else removeDeprecatedObjects(v);
    }
  }
  return data;
}

```