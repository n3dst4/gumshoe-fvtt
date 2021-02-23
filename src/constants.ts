import system from "./system.json";

export const trailPresetId = "trailPreset" as const;
export const nbaPresetId = "nbaPreset" as const;
export const presets = [trailPresetId, nbaPresetId] as const;

export const systemName = system.name;
export const defaultMigratedSystemVersion = "0.0.0" as const;
export const defaultSystemPreset: string = trailPresetId;
export const templatesPath = `systems/${systemName}/templates` as const;
export const reactTemplatePath = `${templatesPath}/react-application.handlebars` as const;

// item types
export const investigativeAbility = "investigativeAbility" as const;
export const generalAbility = "generalAbility" as const;
export const equipment = "equipment" as const;
export const weapon = "weapon" as const;
export const pc = "pc" as const;
export const npc = "npc" as const;

// settings keys
export const defaultThemeName = "defaultThemeName" as const;
export const systemMigrationVersion = "systemMigrationVersion" as const;
export const systemPreset = "systemPreset" as const;
export const investigativeAbilityCategories = "investigativeAbilityCategories" as const;
export const generalAbilityCategories = "generalAbilityCategories" as const;
export const combatAbilities = "combatAbilities" as const;
export const shortNotes = "shortNotes" as const;
export const longNotes = "longNotes" as const;
/**
 * @deprecated use investigativeAbilityCategories and generalAbilityCategories instead
 */
export const abilityCategories = "abilityCategories" as const;

// assets
export const investigativeAbilityIcon = `/systems/${system.name}/assets/icons/magnifying-glass.webp` as const;
export const generalAbilityIcon = `/systems/${system.name}/assets/icons/fist.webp` as const;

// packs

export const packNames = {
  trailOfCthulhuAbilities: "trailOfCthulhuAbilities",
  nightsBlackAgentsAbilities: "nightsBlackAgentsAbilities",
};
