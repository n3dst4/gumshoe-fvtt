import system from "./system.json";

export const systemName = system.name;
export const version = system.version;
export const defaultMigratedSystemVersion = "0.0.0" as const;
export const defaultSystemPreset = "pathOfCthulhuPreset";
export const templatesPath = `systems/${systemName}/templates` as const;
export const reactTemplatePath = `${templatesPath}/react-application.hbs` as const;
export const reactifiedSidebarTemplatePath = `${templatesPath}/reactified-sidebar-tab.hbs` as const;
export const customSystem = "customSystem" as const;
export const genericOccupationDefault = "Investigator";
export const showEmptyInvestigativeCategoriesDefault = true;

// item types
export const investigativeAbility = "investigativeAbility" as const;
export const generalAbility = "generalAbility" as const;
export const equipment = "equipment" as const;
export const weapon = "weapon" as const;
export const pc = "pc" as const;
export const npc = "npc" as const;
export const party = "party" as const;
export const mwItem = "mwItem" as const;

// assets
export const investigativeAbilityIcon = `/systems/${systemName}/assets/icons/magnifying-glass.webp` as const;
export const generalAbilityIcon = `/systems/${systemName}/assets/icons/fist.webp` as const;
export const weaponIcon = `/systems/${systemName}/assets/icons/trench-knife.webp` as const;
export const equipmentIcon = `/systems/${systemName}/assets/icons/shopping-bag.webp` as const;
export const pcIcon = `/systems/${systemName}/assets/icons/sherlock-holmes.webp` as const;
export const npcIcon = `/systems/${systemName}/assets/icons/cowled.webp` as const;
export const partyIcon = `/systems/${systemName}/assets/icons/dark-squad.webp` as const;

// packs

export const packNames = {
  niceBlackAgentsAbilities: "niceBlackAgentsAbilities" as const,
  nothingToFearAbilities: "nothingToFearAbilities" as const,
  pallidStarsAbilities: "pallidStarsAbilities" as const,
  pathOfCthulhuAbilities: "pathOfCthulhuAbilities" as const,
  srdAbilities: "srdAbilities" as const,
  castingTheRunesAbilities: "castingTheRunesAbilities" as const,
  moribundWorldAbilities: "moribundWorldAbilities" as const,
};

export const npcPackName = "opponentAbilities" as const;

// hooks
export const newPCPacksUpdated = `${systemName}:newPCPacksUpdated` as const;
export const newNPCPacksUpdated = `${systemName}:newNPCPacksUpdated` as const;
export const settingsSaved = `${systemName}:settingsSaved` as const;
export const requestTurnPass = `${systemName}:requestTurnPass` as const;

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

// other?
export const mwWallopCost = 5;
export const mwNegateCost = 3;
export const defaultCustomThemePath = "investigator_themes";

// flags

export const passingTurnsRemaining = "passingTurnsRemaining";
export const extraPassingTurns = "extraPassingTurns";
