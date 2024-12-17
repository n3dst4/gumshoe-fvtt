import * as constants from "../constants";
import { InvestigatorActor } from "../module/InvestigatorActor";
import { InvestigatorCombat } from "../module/InvestigatorCombat";
import { InvestigatorCombatant } from "../module/InvestigatorCombatant";
import { InvestigatorCombatTracker } from "../module/InvestigatorCombatTracker";
import { InvestigatorItem } from "../module/InvestigatorItem";
import { ItemSheetClass } from "../module/InvestigatorItemSheetClass";
import { ItemSheetV2Class } from "../module/InvestigatorItemSheetV2Class";
import { InvestigatorJournalSheet } from "../module/InvestigatorJournalSheet";
import { JournalEditorSheetClass } from "../module/JournalEditorSheetClass";
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
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet(constants.systemId, PCSheetClass, {
    makeDefault: true,
    types: [constants.pc],
  });
  Actors.registerSheet(constants.systemId, NPCSheetClass, {
    makeDefault: true,
    types: [constants.npc],
  });
  Actors.registerSheet(constants.systemId, PartySheetClass, {
    makeDefault: true,
    types: [constants.party],
  });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet(constants.systemId, ItemSheetClass, {
    makeDefault: true,
    types: [
      constants.weapon,
      constants.equipment,
      constants.investigativeAbility,
      constants.generalAbility,
      constants.mwItem,
      constants.personalDetail,
      constants.card,
    ],
  });
  // @ts-expect-error - we don't have a V2 types yet
  Items.registerSheet(constants.systemId, ItemSheetV2Class, {
    makeDefault: false,
    types: [
      constants.weapon,
      constants.equipment,
      constants.investigativeAbility,
      constants.generalAbility,
      constants.mwItem,
      constants.personalDetail,
      constants.card,
    ],
  });
  Journal.registerSheet("investigator", JournalEditorSheetClass, {
    types: ["base"],
    makeDefault: false,
    label: "Investigator Journal Editor",
  });
  Journal.registerSheet("investigator", InvestigatorJournalSheet, {
    types: ["base"],
    makeDefault: false,
    label: "Investigator Journal Sheet",
  });
};
