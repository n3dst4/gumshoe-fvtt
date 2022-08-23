import * as constants from "../constants";
import { InvestigatorActor } from "../module/InvestigatorActor";
import { InvestigatorCombat } from "../module/InvestigatorCombat";
import { InvestigatorCombatant } from "../module/InvestigatorCombatant";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { InvestigatorCombatTracker } from "../module/InvestigatorCombatTracker";
import { InvestigatorItem } from "../module/InvestigatorItem";
import { AbilitySheetClass, EquipmentSheetClass, MwItemSheetClass } from "../module/InvestigatorItemSheetClass";
import { NPCSheetClass } from "../module/NPCSheetClass";
import { PartySheetClass } from "../module/PartySheetClass";
import { PCSheetClass } from "../module/PCSheetClass";

export const registerSheetsAndClasses = () => {
  // XXX TS needs going over here
  CONFIG.Actor.documentClass = InvestigatorActor;
  CONFIG.Item.documentClass = InvestigatorItem;
  CONFIG.Combatant.documentClass = InvestigatorCombatant;
  CONFIG.Combat.documentClass = InvestigatorCombat;
  // CONFIG.ChatMessage.documentClass = InvestigatorChatMessage;
  CONFIG.ui.combat = InvestigatorCombatTracker;

  // Register custom sheets (if any)
  // Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet(constants.systemName, PCSheetClass, {
    makeDefault: true,
    types: [constants.pc],
  });
  Actors.registerSheet(constants.systemName, NPCSheetClass, {
    makeDefault: true,
    types: [constants.npc],
  });
  Actors.registerSheet(constants.systemName, PartySheetClass, {
    makeDefault: true,
    types: [constants.party],
  });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet(constants.systemName, EquipmentSheetClass, {
    makeDefault: true,
    types: [constants.weapon, constants.equipment],
  });
  Items.registerSheet(constants.systemName, AbilitySheetClass, {
    makeDefault: true,
    types: [constants.investigativeAbility, constants.generalAbility],
  });
  Items.registerSheet(constants.systemName, MwItemSheetClass, {
    makeDefault: true,
    types: [constants.mwItem],
  });
};
