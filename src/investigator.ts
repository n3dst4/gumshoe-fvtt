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
import { RecursivePartial, GumshoeItemData } from "./types";
import { getFolderDescendants, isAbility, isGeneralAbility, isNullOrEmptyString } from "./functions";
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
  CONFIG.Actor.documentClass = GumshoeActor;
  CONFIG.Item.documentClass = GumshoeItem;
  CONFIG.Combat.documentClass = GumshoeCombat;

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
    data: RecursivePartial<ItemData<GumshoeItemData>>,
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
  const systemNameTranslated = game.i18n.localize(
    `${systemName}.SystemName`,
  );
  const text = game.i18n.format(`${systemName}.SystemNameSystemSettings`, {
    SystemName: systemNameTranslated,
  });
  const button = $(`<button><i class="fas fa-search"></i>${text}</button>`);
  html.find('button[data-action="configure"]').after(button);

  button.on("click", ev => {
    ev.preventDefault();
    gumshoeSettingsClassInstance.render(true);
  });
});

Hooks.on(
  "dropActorSheetData",
  (
    targetActor: GumshoeActor,
    application: Application,
    dropData: { type: string, id: string, entity?: string },
  ) => {
    if (
      targetActor.data.type !== party ||
      (dropData.type !== "Actor" &&
        (dropData.type !== "Folder" || dropData.entity !== "Actor")) ||
      !game.user.isGM
    ) {
      return;
    }
    const actorIds = dropData.type === "Actor"
      ? [dropData.id]
      : getFolderDescendants(game.folders.get(dropData.id)).filter((actor) => actor.data.type === pc).map((actor) => actor.id);
    targetActor.addActorIds(actorIds);
  },
);

CONFIG.debug.hooks = true;

initializePackGenerators();
