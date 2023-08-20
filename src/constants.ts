import system from "../public/system.json";

export const systemId = system.id;
export const version = system.version;
export const defaultMigratedSystemVersion = "0.0.0" as const;
export const defaultSystemPreset = "pathOfCthulhuPreset";
export const templatesPath = `systems/${systemId}/templates` as const;
export const reactTemplatePath =
  `${templatesPath}/react-application.hbs` as const;
export const reactifiedCombatSidebarTemplatePath =
  `${templatesPath}/reactified-combat-sidebar.hbs` as const;
export const customSystem = "customSystem" as const;
export const genericOccupationDefault = "Investigator";
export const showEmptyInvestigativeCategoriesDefault = true;
export const inputThrottleTime = 500;

// item types
export const investigativeAbility = "investigativeAbility" as const;
export const generalAbility = "generalAbility" as const;
export const equipment = "equipment" as const;
export const weapon = "weapon" as const;
export const pc = "pc" as const;
export const npc = "npc" as const;
export const party = "party" as const;
export const mwItem = "mwItem" as const;
export const personalDetail = "personalDetail" as const;

// assets
export const investigativeAbilityIcon =
  `/systems/${systemId}/assets/icons/magnifying-glass.webp` as const;
export const generalAbilityIcon =
  `/systems/${systemId}/assets/icons/fist.webp` as const;
export const weaponIcon =
  `/systems/${systemId}/assets/icons/trench-knife.webp` as const;
export const equipmentIcon =
  `/systems/${systemId}/assets/icons/shopping-bag.webp` as const;
export const pcIcon =
  `/systems/${systemId}/assets/icons/sherlock-holmes.webp` as const;
export const npcIcon = `/systems/${systemId}/assets/icons/cowled.webp` as const;
export const partyIcon =
  `/systems/${systemId}/assets/icons/dark-squad.webp` as const;
export const personalDetailIcon =
  `/systems/${systemId}/assets/icons/notebook.webp` as const;

// packs

export const packNames = {
  niceBlackAgentsAbilities: "niceBlackAgentsAbilities" as const,
  nothingToFearAbilities: "nothingToFearAbilities" as const,
  pallidStarsAbilities: "pallidStarsAbilities" as const,
  pathOfCthulhuAbilities: "pathOfCthulhuAbilities" as const,
  srdAbilities: "srdAbilities" as const,
  castingTheRunesAbilities: "castingTheRunesAbilities" as const,
  moribundWorldAbilities: "moribundWorldAbilities" as const,
  esoterroristsAbilities: "esoterroristsAbilities" as const,
};

export const npcPackName = "opponentAbilities" as const;

// hooks
export const newPCPacksUpdated = `${systemId}.newPCPacksUpdated` as const;
export const newNPCPacksUpdated = `${systemId}.newNPCPacksUpdated` as const;
export const settingsSaved = `${systemId}.settingsSaved` as const;
export const requestTurnPass = `${systemId}.requestTurnPass`;
export const socketScope = `system.${systemId}` as const;

// css classes
export const abilityChatMessageClassName = "investigator-ability-test" as const;
export const htmlDataItemId = "data-item-id" as const;
export const htmlDataActorId = "data-actor-id" as const;
export const htmlDataMode = "data-mode" as const;
export const htmlDataModeTest = "test" as const;
export const htmlDataModeSpend = "spend" as const;
export const htmlDataModeAttack = "attack" as const;
export const htmlDataModeMwTest = "mw-test" as const;
export const htmlDataModeMwWallop = "mw-wallop" as const;
export const htmlDataModeMwNegate = "mw-negate" as const;
export const htmlDataRange = "data-range" as const;
export const htmlDataWeaponId = "data-weapon-id" as const;
export const htmlDataName = "data-name" as const;
export const htmlDataImageUrl = "data-image-url" as const;
export const htmlDataMwDifficulty = "data-mw-difficulty" as const;
export const htmlDataMwBoonLevy = "data-mw-boon-levy" as const;
export const htmlDataMwReRoll = "data-mw-re-roll" as const;
export const htmlDataMwPool = "data-mw-pool" as const;
export const htmlDataTokenId = "data-token-id" as const;

// other?
export const mwWallopCost = 5;
export const mwNegateCost = 3;
export const defaultCustomThemePath = "investigator_themes";

// flags

export const passingTurnsRemaining = "passingTurnsRemaining";
export const extraPassingTurns = "extraPassingTurns";

// magic values

export const occupationSlotIndex = -1;
