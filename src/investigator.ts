import "./setWebkitPublicPath";
import { registerSettings } from "./module/registerSettings";
import { preloadTemplates } from "./module/preloadTemplates";
import { InvestigatorActor } from "./module/InvestigatorActor";
import { InvestigatorItem } from "./module/InvestigatorItem";
import { InvestigatorPCSheetClass } from "./module/InvestigatorPCSheetClass";
import { InvestigatorAbilitySheetClass, InvestigatorEquipmentSheetClass, InvestigatorMwItemSheetClass } from "./module/InvestigatorItemSheetClass";
import { defaultMigratedSystemVersion, equipment, equipmentIcon, generalAbility, generalAbilityIcon, investigativeAbility, investigativeAbilityIcon, party, pc, npc, systemName, weapon, weaponIcon, mwItem } from "./constants";
import system from "./system.json";
import { migrateWorld } from "./migrations/migrateWorld";
import { isAbilityDataSource, isGeneralAbilityDataSource, isWeaponDataSource, isEquipmentDataSource } from "./types";
import { assertGame, getFolderDescendants, isNullOrEmptyString } from "./functions";
import { initializePackGenerators } from "./compendiumFactory/generatePacks";
import { investigatorSettingsClassInstance } from "./module/InvestigatorSettingsClass";
import { getDefaultGeneralAbilityCategory, getDefaultInvestigativeAbilityCategory, getSystemMigrationVersion } from "./settingsHelpers";
import { InvestigatorPartySheetClass } from "./module/InvestigatorPartySheetClass";
import { InvestigatorNPCSheetClass } from "./module/InvestigatorNPCSheetClass";
import { InvestigatorCombatant } from "./module/InvestigatorCombatant";
import { installCompendiumExportButton } from "./compendiumFactory/installCompendiumExportButton";
import { InvestigatorCombat } from "./module/InvestigatorCombat";
import { installShowThemeFarmHack } from "./module/ThemeFarmClass";
import { installAbilityCardChatWrangler } from "./components/messageCards/installAbilityCardChatWrangler";
// import { InvestigatorChatMessage } from "./module/InvestigatorChatMessage";

// Initialize system
Hooks.once("init", async function () {
  // this is how we could delete an item type, if we felt like it:
  // assertGame(game);
  // delete CONFIG.Item.typeLabels.generalAbility;
  // game.system.entityTypes.Item.splice(
  //   game.system.entityTypes.Item.indexOf("generalAbility"),
  //   1
  // );

  console.log(`${systemName} | Initializing system`);
  // Assign custom classes and constants here

  // Register custom system settings
  registerSettings();

  // Preload Handlebars templates
  await preloadTemplates();

  // XXX TS needs going over here
  CONFIG.Actor.documentClass = InvestigatorActor;
  CONFIG.Item.documentClass = InvestigatorItem;
  CONFIG.Combatant.documentClass = InvestigatorCombatant;
  CONFIG.Combat.documentClass = InvestigatorCombat;
  // CONFIG.ChatMessage.documentClass = InvestigatorChatMessage;

  // Register custom sheets (if any)
  // Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet(
    systemName,
    InvestigatorPCSheetClass,
    {
      makeDefault: true,
      types: [pc],
    });
  Actors.registerSheet(
    systemName,
    InvestigatorNPCSheetClass,
    {
      makeDefault: true,
      types: [npc],
    });
  Actors.registerSheet(
    systemName,
    InvestigatorPartySheetClass,
    {
      makeDefault: true,
      types: [party],
    });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet(
    systemName,
    InvestigatorEquipmentSheetClass,
    {
      makeDefault: true,
      types: [weapon, equipment],
    },
  );
  Items.registerSheet(
    systemName,
    InvestigatorAbilitySheetClass,
    {
      makeDefault: true,
      types: [investigativeAbility, generalAbility],
    },
  );
  Items.registerSheet(
    systemName,
    InvestigatorMwItemSheetClass,
    {
      makeDefault: true,
      types: [mwItem],
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
  const NEEDS_MIGRATION_VERSION = "4.7.2";
  // oldest version which can be migrated reliably
  const COMPATIBLE_MIGRATION_VERSION = "1.0.0";
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

Hooks.on("ready", async () => {
  assertGame(game);
  // turn off simultaneous rolls for DSN
  // simone's version from the docs:
  game.settings.set("dice-so-nice", "enabledSimultaneousRollForMessage", false);
  // the one that actually exists:
  game.settings.set("dice-so-nice", "enabledSimultaneousRolls", false);
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
    investigatorSettingsClassInstance.render(true);
  });
});

Hooks.on(
  "dropActorSheetData",
  (
    targetActor: InvestigatorActor,
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

installAbilityCardChatWrangler();
