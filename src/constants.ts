import systemJson from "./system.json";

export const systemName = systemJson.name;
export const templatePath = `systems/${systemName}/templates`;
export const reactTemplate = `${templatePath}/react-application.handlebars`;

export const investigativeSkill = "investigativeSkill";
export const generalSkill = "generalSkill";
export const equipment = "equipment";
export const pc = "pc";
export const npc = "npc";
