import { settings } from "./settings";

export const getDefaultGeneralAbilityCategory = () => {
  const cat = settings.generalAbilityCategories.get()[0];
  if (!cat) {
    throw new Error("No general ability categories found in system settings");
  }
  return cat;
};

export const getDefaultInvestigativeAbilityCategory = () => {
  const cat = settings.investigativeAbilityCategories.get()[0];
  if (!cat) {
    throw new Error("No investigative ability categories found in system settings");
  }
  return cat;
};
