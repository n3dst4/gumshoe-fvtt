import system from "./system.json";

export const systemName = system.name;
export const defaultMigratedSystemVersion = "0.0.0" as const;
export const defaultSystemPreset = "pathOfCthulhuPreset";
export const templatesPath = `systems/${systemName}/templates` as const;
export const reactTemplatePath = `${templatesPath}/react-application.hbs` as const;
export const customSystem = "customSystem" as const;

// item types
export const investigativeAbility = "investigativeAbility" as const;
export const generalAbility = "generalAbility" as const;
export const equipment = "equipment" as const;
export const weapon = "weapon" as const;
export const pc = "pc" as const;
export const npc = "npc" as const;
export const party = "party" as const;
export const mwItem = "mwItem" as const;

// settings keys
export const defaultThemeName = "defaultThemeName" as const;
export const systemMigrationVersion = "systemMigrationVersion" as const;
export const systemPreset = "systemPreset" as const;
export const investigativeAbilityCategories = "investigativeAbilityCategories" as const;
export const generalAbilityCategories = "generalAbilityCategories" as const;
export const combatAbilities = "combatAbilities" as const;
export const occupationLabel = "occupationLabel" as const;
export const shortNotes = "shortNotes" as const;
export const longNotes = "longNotes" as const;
export const newPCPacks = "newPCPacks" as const;
export const newNPCPacks = "newNPCPacks" as const;
export const useBoost = "useBoost" as const;
export const debugTranslations = "debugTranslations" as const;

// settings for MW-specific settings
export const mwHiddenShortNotes = "mwHiddenShortNotes" as const;

export const useMwStyleAbilities = "useMwStyleAbilities" as const;

export const mwUseAlternativeItemTypes = "mwUseAlternativeItemTypes" as const;

/**
 * @deprecated use investigativeAbilityCategories and generalAbilityCategories instead
 */
export const abilityCategories = "abilityCategories" as const;

// assets
export const investigativeAbilityIcon = `/systems/${systemName}/assets/icons/magnifying-glass.webp` as const;
export const generalAbilityIcon = `/systems/${systemName}/assets/icons/fist.webp` as const;
export const weaponIcon = `/systems/${systemName}/assets/icons/trench-knife.webp` as const;
export const equipmentIcon = `/systems/${systemName}/assets/icons/shopping-bag.webp` as const;

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
