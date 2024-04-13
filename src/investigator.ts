// ned to bring in these global types manually
import "@lumphammer/shared-fvtt-bits/src/ApplicationV2Types";

import { initializePackGenerators } from "./compendiumFactory/generatePacks";
import { systemId } from "./constants";
import { assertGame, systemLogger } from "./functions/utilities";
import processedStyles from "./investigator.less?inline";
import { handleMwItemType } from "./startup/disableMwItemType";
import { injectGlobalHelper } from "./startup/injectGlobalHelper";
import { installAbilityCardChatWrangler } from "./startup/installAbilityCardChatWrangler";
import { installAbilityCategoryHookHandler } from "./startup/installAbilityCategoryHookHandler";
import { installActorImageHookHandler } from "./startup/installActorImageHookHandler";
import { installCompendiumExportButton } from "./startup/installCompendiumExportButton";
import { installDropActorSheetDataHandler } from "./startup/installDropActorSheetDataHandler";
import { installDSNFix } from "./startup/installDSNFix";
import { installEquipmentCategoryHookHandler } from "./startup/installEquipmentCategoryHookHandler";
import { installInitiativeUpdateHookHandler } from "./startup/installInitiativeUpdateHookHandler";
import { installItemImageHookHandler } from "./startup/installItemImageHookHandler";
import { installKeepTokenImageInSyncWithActor } from "./startup/installKeepTokenImageInSyncWithActor";
import { installNewCharacterDefaultOccupationHookHandler } from "./startup/installNewCharacterDefaultOccupationHookHandler";
import { installNewCharacterPacksHookHandler } from "./startup/installNewCharacterPacksHookHandler";
import { installPersonalDetailHookHandler } from "./startup/installPersonalDetailHookHandler";
import { installRenderSettingsHandler } from "./startup/installRenderSettingsHandler";
import { installResourceUpdateHookHandler } from "./startup/installResourceUpdateHookHandler";
import { installShowThemeFarmHack } from "./startup/installShowThemeFarmHack";
import { installSocketActionHandler } from "./startup/installSocketActionHandler";
import { installTurnPassingHandler } from "./startup/installTurnPassingHandler";
import { loadCustomThemes } from "./startup/loadCustomThemes";
import { migrateWorldIfNeeded } from "./startup/migrateWorldIfNeeded";
import { preloadTemplates } from "./startup/preloadTemplates";
import { registerBabele } from "./startup/registerBabele";
import { registerDevModeDebugFlag } from "./startup/registerDevModeDebugFlag";
import { registerSettingsMenu } from "./startup/registerSettingsMenu";
import { registerSheetsAndClasses } from "./startup/registerSheetsAndClasses";

injectGlobalHelper();

// Inject CSS
// normal css imports don't work in foundry because the html is loaded from
// foundry itself and vite's css injection never kicks in. So we have to
// import the css as a string and inject it ourselves.
const styleElement = document.createElement("style");
styleElement.innerHTML = processedStyles;
document.head.appendChild(styleElement);

// Initialize system
Hooks.once("init", async function () {
  systemLogger.log(`Initializing ${systemId} system`);
  registerSettingsMenu();
  await preloadTemplates();
  registerSheetsAndClasses();
  registerBabele();
});

// Setup system
Hooks.once("setup", function () {
  installShowThemeFarmHack();
});

Hooks.once("ready", async () => {
  await migrateWorldIfNeeded();
  await installDSNFix();

  assertGame(game);
  for (const combat of game.combats?.values() ?? []) {
    combat.setupTurns();
  }
});

installAbilityCategoryHookHandler();
installItemImageHookHandler();
installRenderSettingsHandler();
installDropActorSheetDataHandler();
registerDevModeDebugFlag();
installActorImageHookHandler();
installCompendiumExportButton();
initializePackGenerators();
installAbilityCardChatWrangler();
loadCustomThemes();
handleMwItemType();
installInitiativeUpdateHookHandler();
installTurnPassingHandler();
installSocketActionHandler();
installEquipmentCategoryHookHandler();
installPersonalDetailHookHandler();
installResourceUpdateHookHandler();
installNewCharacterPacksHookHandler();
installKeepTokenImageInSyncWithActor();
installNewCharacterDefaultOccupationHookHandler();

// if (game instanceof Game && /^12\./.test(game.version)) {
//   try {
//     makeDummyAppV2();
//   } catch (e) {
//     console.error(e);
//   }
//   // makeDummyAppV2();
// }
