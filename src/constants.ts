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
export const useBoost = "useBoost" as const;
export const debugTranslations = "debugTranslations" as const;

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
  niceBlackAgentsAbilities: "niceBlackAgentsAbilities",
  nothingToFearAbilities: "nothingToFearAbilities",
  pallidStarsAbilities: "pallidStarsAbilities",
  pathOfCthulhuAbilities: "pathOfCthulhuAbilities",
  srdAbilities: "srdAbilities",
};

// hooks

export const newPCPacksUpdated = `${systemName}:newPCPacksUpdated`;
