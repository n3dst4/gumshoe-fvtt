import systemJson from "./system.json";

export const systemName = systemJson.name;
export const templatesPath = `systems/${systemName}/templates`;
export const reactTemplatePath = `${templatesPath}/react-application.handlebars`;

export const investigativeSkill = "investigativeSkill";
export const generalSkill = "generalSkill";
export const equipment = "equipment";
export const pc = "pc";
export const npc = "npc";
