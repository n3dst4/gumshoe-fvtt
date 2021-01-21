import { registerSettings } from "./module/settings";
import { preloadTemplates } from "./module/preloadTemplates";
import { TrailActor } from "./module/TrailActor";
import { TrailItem } from "./module/TrailItem";
import { TrailActorSheetClass } from "./module/TrailActorSheetClass";
import { TrailItemSheetClass } from "./module/TrailItemSheetClass";
import { equipment, generalAbility, investigativeAbility } from "./constants";

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

function updateName (itemData: ItemData<any>, diff: Record<string, any>) {
  console.log("!!!preUpdateOwnedItem", diff);
  const isAbility = itemData.type === investigativeAbility || itemData.type === generalAbility;
  if (isAbility && diff.data && (diff.data.baseName !== undefined || diff.data.hasSpeciality !== undefined || diff.data.speciality !== undefined)) {
    const hasSpeciality = diff.data.hasSpeciality === undefined ? itemData.data.hasSpeciality : diff.data.hasSpeciality;
    const baseName = diff.data.baseName === undefined ? itemData.data.baseName : diff.data.baseName;
    const speciality = diff.data.speciality === undefined ? itemData.data.speciality : diff.data.speciality;
    diff.name = hasSpeciality ? `${baseName} (${speciality})` : baseName;
  }
}

Hooks.on("preUpdateOwnedItem", (actor, itemData, diff, options, actorId) => {
  updateName(itemData, diff);
});
Hooks.on("preUpdateItem", (item, diff, options, actorId) => {
  updateName(item.data, diff);
});

CONFIG.debug.hooks = true;
// Add any additional hooks if necessary
