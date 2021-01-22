import { registerSettings } from "./module/settings";
import { preloadTemplates } from "./module/preloadTemplates";
import { TrailActor } from "./module/TrailActor";
import { TrailItem } from "./module/TrailItem";
import { TrailActorSheetClass } from "./module/TrailActorSheetClass";
import { TrailItemSheetClass } from "./module/TrailItemSheetClass";
import { equipment, generalAbility, investigativeAbility } from "./constants";
import { isAbility } from "./functions";

// Initialize system
Hooks.once("init", async function () {
  console.log("trail-of-cthulhu-unsanctioned | Initializing system");
  // Assign custom classes and constants here

  // Register custom system settings
  registerSettings();

  // Preload Handlebars templates
  await preloadTemplates();

  CONFIG.Actor.entityClass = TrailActor;
  CONFIG.Item.entityClass = TrailItem;

  // Register custom sheets (if any)
  // Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("trail-of-cthulhu-unsanctioned", TrailActorSheetClass, { makeDefault: true });
  Items.registerSheet(
    "trail-of-cthulhu-unsanctioned",
    TrailItemSheetClass,
    {
      makeDefault: true,
      types: [investigativeAbility, generalAbility, equipment],
    },
  );
});

// Setup system
Hooks.once("setup", function () {
  // Do anything after initialization but before
  // ready
});

// When ready
Hooks.once("ready", function () {
  // Do anything once the system is ready
});

function makeName (baseName: string, speciality: string, hasSpeciality: boolean) {
  return hasSpeciality ? `${baseName} (${speciality})` : baseName;
}

function updateName (itemData: ItemData<any>, diff: Record<string, any>) {
  console.log("!!!preUpdateOwnedItem", diff);
  if (
    isAbility(itemData.type) &&
    diff.data &&
    (diff.data.baseName !== undefined ||
      diff.data.hasSpeciality !== undefined ||
      diff.data.speciality !== undefined)
  ) {
    const hasSpeciality =
      diff.data.hasSpeciality === undefined
        ? itemData.data.hasSpeciality
        : diff.data.hasSpeciality;
    const baseName =
      diff.data.baseName === undefined
        ? itemData.data.baseName
        : diff.data.baseName;
    const speciality =
      diff.data.speciality === undefined
        ? itemData.data.speciality
        : diff.data.speciality;
    diff.name = makeName(baseName, speciality, hasSpeciality);
  }
}

Hooks.on("preUpdateOwnedItem", (actor, itemData, diff, options, actorId) => {
  updateName(itemData, diff);
});
Hooks.on("preUpdateItem", (item, diff, options, actorId) => {
  updateName(item.data, diff);
});

Hooks.on("createItem", (item, diff, options, actorId) => {
  if (isAbility(item.data.type) && !item.data.data.baseName) {
    item.update({
      data: {
        baseName: item.data.name,
      },
    });
  }
});

// XXX revisit this hook when we want to think about creating abilities
// directly
// Hooks.on("createOwnedItem", (actor: Actor, itemData, options, actorId) => {
//   if (isAbility(itemData.type)) {
//     actor.updateOwnedItem({
//       ...itemData,
//       dat
//     })
//   }
// });

// CONFIG.debug.hooks = true;
