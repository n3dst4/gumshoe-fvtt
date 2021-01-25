import systemJson from "./system.json";

export const systemName = systemJson.name;
export const templatesPath = `systems/${systemName}/templates`;
export const reactTemplatePath = `${templatesPath}/react-application.handlebars`;

export const investigativeAbility = "investigativeAbility";
export const generalAbility = "generalAbility";
export const equipment = "equipment";
export const weapon = "weapon";
export const pc = "pc";
export const npc = "npc";
export const abilityCategories = "abilityCategories";
