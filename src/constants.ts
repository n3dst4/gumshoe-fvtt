import systemJson from "./system.json";

export const systemName = systemJson.name;
export const templatePath = `systems/${systemName}/templates`;
export const reactTemplate = `${templatePath}/react-application.handlebars`;
