import { registerSettings } from "./module/settings";
import { preloadTemplates } from "./module/preloadTemplates";
import { TrailActor } from "./module/TrailActor";
import { TrailItem } from "./module/TrailItem";
import { TrailActorSheetClass } from "./module/TrailActorSheetClass";
import { TrailItemSheetClass } from "./module/TrailItemSheetClass";
import { equipment, generalAbility, investigativeAbility, systemMigrationVersion, weapon } from "./constants";
import { TrailCombat } from "./module/TrailCombat";
import system from "./system.json";
import { migrateWorld } from "./migrations/migrateWorld";
import { RecursivePartial, TrailItemData } from "./types";
import { isNullOrEmptyString } from "./functions";
import { getDefaultGeneralAbilityCategory, getDefaultInvestigativeAbilityCategory } from "./helpers";
import { initializePackGenerators } from "./compendiumFactory/generatePacks";

// Initialize system
Hooks.once("init", async function () {
  console.log("trail-of-cthulhu-unsanctioned | Initializing system");
  // Assign custom classes and constants here

  // Register custom system settings
  registerSettings();

  // Preload Handlebars templates
  await preloadTemplates();

  // XXX TS needs going over here
  CONFIG.Actor.entityClass = (TrailActor as any);
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

// Migration hook
Hooks.on("ready", async () => {
  if (!game.user.isGM) { return; }

  const currentVersion = game.settings.get(system.name, systemMigrationVersion);
  // newest version that needs a migration (make this the current version when
  // you introduce a new migration)
  const NEEDS_MIGRATION_VERSION = "1.0.0-alpha.4";
  // oldest version which can be migrated reliably
  const COMPATIBLE_MIGRATION_VERSION = "1.0.0-alpha.2";
  const needsMigration = isNewerVersion(NEEDS_MIGRATION_VERSION, currentVersion);
  if (!needsMigration) return;

  // warn users on old versions
  if (currentVersion && isNewerVersion(COMPATIBLE_MIGRATION_VERSION, currentVersion)) {
    const warning = `Your ${system.title} system data is from too old a version and cannot be reliably migrated to the latest version. The process will be attempted, but errors may occur.`;
    ui.notifications.error(warning, { permanent: true });
  }

  // Perform the migration
  migrateWorld();
});

Hooks.on(
  "preCreateItem",
  (
    data: RecursivePartial<ItemData<TrailItemData>>,
    options: any,
    userId: string,
  ) => {
    if (game.userId !== userId) return;
    if (
      (data.type === generalAbility || data.type === investigativeAbility) &&
      isNullOrEmptyString(data.data?.category)
    ) {
      console.log(
        `found ability with no category, updating to ${getDefaultGeneralAbilityCategory()}`,
      );
      data.data = data.data || {};
      data.data.category =
        data.type === generalAbility
          ? getDefaultGeneralAbilityCategory()
          : getDefaultInvestigativeAbilityCategory();
    }
  },
);

CONFIG.debug.hooks = true;

initializePackGenerators();
