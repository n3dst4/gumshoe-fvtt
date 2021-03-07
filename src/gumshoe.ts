import { registerSettings } from "./module/settings";
import { preloadTemplates } from "./module/preloadTemplates";
import { GumshoeActor } from "./module/GumshoeActor";
import { GumshoeItem } from "./module/GumshoeItem";
import { GumshoeActorSheetClass } from "./module/GumshoeActorSheetClass";
import { GumshoeItemSheetClass } from "./module/GumshoeItemSheetClass";
import { defaultMigratedSystemVersion, equipment, generalAbility, generalAbilityIcon, investigativeAbility, investigativeAbilityIcon, party, pc, systemName, weapon } from "./constants";
import { GumshoeCombat } from "./module/GumshoeCombat";
import system from "./system.json";
import { migrateWorld } from "./migrations/migrateWorld";
import { RecursivePartial, TrailItemData } from "./types";
import { isAbility, isGeneralAbility, isNullOrEmptyString } from "./functions";
import { initializePackGenerators } from "./compendiumFactory/generatePacks";
import { gumshoeSettingsClassInstance } from "./module/GumshoeSettingsClass";
import { getDefaultGeneralAbilityCategory, getDefaultInvestigativeAbilityCategory, getSystemMigrationVersion } from "./settingsHelpers";
import { GumshoePartySheetClass } from "./module/GumshoePartySheetClass";

// Initialize system
Hooks.once("init", async function () {
  console.log(`${systemName} | Initializing system`);
  // Assign custom classes and constants here

  // Register custom system settings
  registerSettings();

  // Preload Handlebars templates
  await preloadTemplates();

  // XXX TS needs going over here
  CONFIG.Actor.entityClass = (GumshoeActor as any);
  CONFIG.Item.entityClass = GumshoeItem;
  CONFIG.Combat.entityClass = GumshoeCombat;

  // Register custom sheets (if any)
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet(
    systemName,
    GumshoeActorSheetClass,
    {
      makeDefault: true,
      types: [pc],
    });
  Actors.registerSheet(
    systemName,
    GumshoePartySheetClass,
    {
      makeDefault: true,
      types: [party],
    });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet(
    systemName,
    GumshoeItemSheetClass,
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

  const currentVersion = getSystemMigrationVersion();
  // newest version that needs a migration (make this the current version when
  // you introduce a new migration)
  const NEEDS_MIGRATION_VERSION = "1.0.0-alpha.5";
  // oldest version which can be migrated reliably
  const COMPATIBLE_MIGRATION_VERSION = "1.0.0-alpha.2";
  const needsMigration = isNewerVersion(NEEDS_MIGRATION_VERSION, currentVersion);
  if (!needsMigration) return;

  // warn users on old versions
  if (
    currentVersion &&
    currentVersion !== defaultMigratedSystemVersion &&
    isNewerVersion(COMPATIBLE_MIGRATION_VERSION, currentVersion)
  ) {
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

    // ABILITIES
    if (isAbility(data.type ?? "")) {
      // set category
      if (isNullOrEmptyString(data.data?.category)) {
        const category = generalAbility
          ? getDefaultGeneralAbilityCategory()
          : getDefaultInvestigativeAbilityCategory();
        console.log(
          `found ability "${data.name}" with no category, updating to "${category}"`,
        );
        data.data = data.data || {};
        data.data.category = category;
      }

      // set image
      if (isNullOrEmptyString(data.img)) {
        data.img = isGeneralAbility(data.type ?? "") ? generalAbilityIcon : investigativeAbilityIcon;
      }
    }
  },
);

Hooks.on("renderSettings", (app: Application, html: JQuery) => {
  const button = $("<button><i class=\"fas fa-search\"></i>GUMSHOE System Settings</button>");
  html.find('button[data-action="configure"]').after(button);

  button.on("click", ev => {
    ev.preventDefault();
    gumshoeSettingsClassInstance.render(true);
  });
});

CONFIG.debug.hooks = true;

initializePackGenerators();
