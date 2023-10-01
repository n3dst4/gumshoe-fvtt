import "./investigator.less";

import { initializePackGenerators } from "./compendiumFactory/generatePacks";
import { systemId } from "./constants";
import { assertGame, systemLogger } from "./functions/utilities";
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

Hooks.once("ready", () => {
  migrateWorldIfNeeded();
  installDSNFix();

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
