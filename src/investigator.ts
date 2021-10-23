import "./setWebkitPublicPath";
import { registerSettings } from "./module/settings";
import { preloadTemplates } from "./module/preloadTemplates";
import { GumshoeActor } from "./module/GumshoeActor";
import { GumshoeItem } from "./module/GumshoeItem";
import { GumshoeActorSheetClass } from "./module/GumshoeActorSheetClass";
import { GumshoeItemSheetClass } from "./module/GumshoeItemSheetClass";
import { defaultMigratedSystemVersion, equipment, equipmentIcon, generalAbility, generalAbilityIcon, investigativeAbility, investigativeAbilityIcon, party, pc, npc, systemName, weapon, weaponIcon } from "./constants";
import system from "./system.json";
import { migrateWorld } from "./migrations/migrateWorld";
import { isAbilityDataSource, isGeneralAbilityDataSource, isWeaponDataSource, isEquipmentDataSource } from "./types";
import { assertGame, getFolderDescendants, isNullOrEmptyString } from "./functions";
import { initializePackGenerators } from "./compendiumFactory/generatePacks";
import { gumshoeSettingsClassInstance } from "./module/GumshoeSettingsClass";
import { getDefaultGeneralAbilityCategory, getDefaultInvestigativeAbilityCategory, getSystemMigrationVersion } from "./settingsHelpers";
import { GumshoePartySheetClass } from "./module/GumshoePartySheetClass";
import { GumshoeNPCSheetClass } from "./module/GumshoeNPCSheetClass";
import { InvestigatorCombatant } from "./module/InvestigatorCombatant";
import { installCompendiumExportButton } from "./compendiumFactory/installCompendiumExportButton";
import { InvestigatorCombat } from "./module/InvestigatorCombat";
import { installShowThemeFarmHack } from "./module/ThemeFarmClass";
import { installAbilityTestCardChatWrangler } from "./components/messageCards/AbilityTestCard";
// import { InvestigatorChatMessage } from "./module/InvestigatorChatMessage";

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
  CONFIG.Combatant.documentClass = InvestigatorCombatant;
  CONFIG.Combat.documentClass = InvestigatorCombat;
  // CONFIG.ChatMessage.documentClass = InvestigatorChatMessage;

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
    GumshoeNPCSheetClass,
    {
      makeDefault: true,
      types: [npc],
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

  // register babele translations
  if (typeof Babele !== "undefined") {
    const babele = Babele.get();
    if (babele.setSystemTranslationsDir) {
      babele.setSystemTranslationsDir("lang/babele");
    } else {
      const message = "Please make sure you have installed the latest version of Babele (unable to set system translations path).";
      logger.warn(message);
      Hooks.once("ready", () => {
        ui.notifications?.warn(message);
      });
    }
  }
});

// Setup system
Hooks.once("setup", function () {
  // Do anything after initialization but before
  // ready

  // install the console callback to show the theme farm
  installShowThemeFarmHack();
});

// Migration hook
Hooks.on("ready", async () => {
  assertGame(game);
  if (!game.user?.isGM) { return; }

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
    (ui as any /* oh fuck off */).notifications.error(warning, { permanent: true });
  }

  // Perform the migration
  migrateWorld();
});

Hooks.on(
  "preCreateItem",
  (
    item: Item,
    createData: {name: string, type: string, data?: any, img?: string},
    options: any,
    userId: string,
  ) => {
    assertGame(game);
    if (game.userId !== userId) return;

    // ABILITIES
    if (isAbilityDataSource(item.data)) {
      const isGeneralAbility = isGeneralAbilityDataSource(item.data);
      // set category
      if (isNullOrEmptyString(item.data.data.category)) {
        const category = isGeneralAbility
          ? getDefaultGeneralAbilityCategory()
          : getDefaultInvestigativeAbilityCategory();
        console.log(
          `found ability "${createData.name}" with no category, updating to "${category}"`,
        );
        item.data.update({
          data: { category },
        });
      }
    }

    // set image
    if (
      isNullOrEmptyString(item.data.img) ||
      item.data.img === "icons/svg/item-bag.svg"
    ) {
      item.data.update({
        img: isWeaponDataSource(item.data)
          ? weaponIcon
          : isEquipmentDataSource(item.data)
            ? equipmentIcon
            : isGeneralAbilityDataSource(item.data)
              ? generalAbilityIcon
              : investigativeAbilityIcon,
      });
    }
  },
);

Hooks.on("renderSettings", (app: Application, html: JQuery) => {
  assertGame(game);
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
    assertGame(game);
    if (
      targetActor.data.type !== party ||
      (dropData.type !== "Actor" &&
        (dropData.type !== "Folder" || dropData.entity !== "Actor")) ||
      !game.user?.isGM
    ) {
      return;
    }
    const actorIds =
      dropData.type === "Actor"
        ? [dropData.id]
        : dropData.type === "Folder"
          ? getFolderDescendants(game.folders?.get(dropData.id)).filter((actor) => {
              return (actor as any).data.type === pc;
            }).map((actor) => (actor as any).id)
          : [];

    targetActor.addActorIds(actorIds);
  },
);

installCompendiumExportButton();

initializePackGenerators();

installAbilityTestCardChatWrangler();

if (window.location.hostname === "localhost") {
  CONFIG.debug.hooks = true;
}
