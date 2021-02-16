import { generalAbilityCategories, investigativeAbilityCategories } from "./constants";
import system from "./system.json";

export const getDefaultGeneralAbilityCategory = () => {
  const cat = game.settings
    .get(system.name, generalAbilityCategories)
    .split(",")[0]
    ?.trim();
  if (!cat) {
    throw new Error("No general ability categories found in system settings");
  }
  return cat;
};

export const getDefaultInvestigativeAbilityCategory = () => {
  const cat = game.settings
    .get(system.name, investigativeAbilityCategories)
    .split(",")[0]
    ?.trim();
  if (!cat) {
    throw new Error("No investigative ability categories found in system settings");
  }
  return cat;
};
