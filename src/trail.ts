import { registerSettings } from "./module/settings";
import { preloadTemplates } from "./module/preloadTemplates";
import { TrailActor } from "./module/TrailActor";
import { TrailItem } from "./module/TrailItem";
import { TrailActorSheetClass } from "./module/TrailActorSheetClass";
import { TrailItemSheetClass } from "./module/TrailItemSheetClass";
import { equipment, generalAbility, investigativeAbility, weapon } from "./constants";
import { generateTrailAbilitiesData } from "./generateTrailAbilitiesData";
import { TrailCombat } from "./module/TrailCombat";

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
  CONFIG.Combat.entityClass = TrailCombat;

  // Register custom sheets (if any)
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("trail-of-cthulhu-unsanctioned", TrailActorSheetClass, { makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet(
    "trail-of-cthulhu-unsanctioned",
    TrailItemSheetClass,
    {
      makeDefault: true,
      types: [weapon, investigativeAbility, generalAbility, equipment],
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

// CONFIG.debug.hooks = true;

(window as any).generateTrailAbilitiesData = generateTrailAbilitiesData;
