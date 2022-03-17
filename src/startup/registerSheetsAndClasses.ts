import * as constants from "../constants";
import { InvestigatorActor } from "../module/InvestigatorActor";
import { InvestigatorCombat } from "../module/InvestigatorCombat";
import { InvestigatorCombatant } from "../module/InvestigatorCombatant";
import { InvestigatorItem } from "../module/InvestigatorItem";
import { InvestigatorAbilitySheetClass, InvestigatorEquipmentSheetClass, InvestigatorMwItemSheetClass } from "../module/InvestigatorItemSheetClass";
import { InvestigatorNPCSheetClass } from "../module/InvestigatorNPCSheetClass";
import { InvestigatorPartySheetClass } from "../module/InvestigatorPartySheetClass";
import { InvestigatorPCSheetClass } from "../module/InvestigatorPCSheetClass";

export const registerSheetsAndClasses = () => {
  // XXX TS needs going over here
  CONFIG.Actor.documentClass = InvestigatorActor;
  CONFIG.Item.documentClass = InvestigatorItem;
  CONFIG.Combatant.documentClass = InvestigatorCombatant;
  CONFIG.Combat.documentClass = InvestigatorCombat;
  // CONFIG.ChatMessage.documentClass = InvestigatorChatMessage;

  // Register custom sheets (if any)
  // Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet(constants.systemName, InvestigatorPCSheetClass, {
    makeDefault: true,
    types: [constants.pc],
  });
  Actors.registerSheet(constants.systemName, InvestigatorNPCSheetClass, {
    makeDefault: true,
    types: [constants.npc],
  });
  Actors.registerSheet(constants.systemName, InvestigatorPartySheetClass, {
    makeDefault: true,
    types: [constants.party],
  });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet(constants.systemName, InvestigatorEquipmentSheetClass, {
    makeDefault: true,
    types: [constants.weapon, constants.equipment],
  });
  Items.registerSheet(constants.systemName, InvestigatorAbilitySheetClass, {
    makeDefault: true,
    types: [constants.investigativeAbility, constants.generalAbility],
  });
  Items.registerSheet(constants.systemName, InvestigatorMwItemSheetClass, {
    makeDefault: true,
    types: [constants.mwItem],
  });
};
