import system from "./system.json";

export const systemName = system.name;
export const templatesPath = `systems/${systemName}/templates`;
export const reactTemplatePath = `${templatesPath}/react-application.handlebars`;

export const investigativeAbility = "investigativeAbility";
export const generalAbility = "generalAbility";
export const equipment = "equipment";
export const weapon = "weapon";
export const pc = "pc";
export const npc = "npc";

/**
 * @deprecated use investigativeAbilityCategories and generalAbilityCategories instead
 */
export const abilityCategories = "abilityCategories";
export const investigativeAbilityCategories = "investigativeAbilityCategories";
export const generalAbilityCategories = "generalAbilityCategories";
export const combatAbilities = "combatAbilities";
export const defaultTheme = "defaultTheme";
export const systemMigrationVersion = "systemMigrationVersion";
export const shortNotes = "shortNotes";
export const longNotes = "longNotes";
export const investigativeAbilityIcon = `/systems/${system.name}/assets/icons/magnifying-glass.webp`;
export const generalAbilityIcon = `/systems/${system.name}/assets/icons/fist.webp`;
