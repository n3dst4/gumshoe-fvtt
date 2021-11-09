import * as constants from "./constants";
import { assertGame } from "./functions";

const getSetting = <T = string>(key: string) => (): T => {
  assertGame(game);
  return game.settings.get(constants.systemName, key) as T;
};

const setSetting = <T = string>(key: string) => (value: T) => {
  assertGame(game);
  return game.settings.set(constants.systemName, key, value);
};

export const getSystemMigrationVersion = getSetting(constants.systemMigrationVersion);
export const getDefaultThemeName = getSetting(constants.defaultThemeName);
export const getInvestigativeAbilityCategories = getSetting<string[]>(constants.investigativeAbilityCategories);
export const getGeneralAbilityCategories = getSetting<string[]>(constants.generalAbilityCategories);
export const getCombatAbilities = getSetting<string[]>(constants.combatAbilities);
export const getOccupationlabel = getSetting<string>(constants.occupationLabel);
export const getShortNotes = getSetting<string[]>(constants.shortNotes);
export const getLongNotes = getSetting<string[]>(constants.longNotes);
export const getNewPCPacks = getSetting<string[]>(constants.newPCPacks);
export const getNewNPCPacks = getSetting<string[]>(constants.newNPCPacks);
export const getSystemPreset = getSetting<string>(constants.systemPreset);
export const getUseBoost = getSetting<boolean>(constants.useBoost);
export const getDebugTranslations = getSetting<boolean>(constants.debugTranslations);

export const getUseMwStyleAbilities = getSetting<boolean>(constants.useMwStyleAbilities);
export const getMwHiddenShortNotes = getSetting<string[]>(constants.mwHiddenShortNotes);
export const getMwUseAlternativeItemTypes = getSetting<boolean>(constants.mwUseAlternativeItemTypes);

export const setSystemMigrationVersion = setSetting(constants.systemMigrationVersion);
export const setDefaultThemeName = setSetting(constants.defaultThemeName);
export const setInvestigativeAbilityCategories = setSetting<string[]>(constants.investigativeAbilityCategories);
export const setGeneralAbilityCategories = setSetting<string[]>(constants.generalAbilityCategories);
export const setCombatAbilities = setSetting<string[]>(constants.combatAbilities);
export const setOccupationLabel = setSetting<string>(constants.occupationLabel);
export const setShortNotes = setSetting<string[]>(constants.shortNotes);
export const setLongNotes = setSetting<string[]>(constants.longNotes);
export const setNewPCPacks = setSetting<string[]>(constants.newPCPacks);
export const setNewNPCPacks = setSetting<string[]>(constants.newNPCPacks);
export const setSystemPreset = setSetting<string>(constants.systemPreset);
export const setUseBoost = setSetting<boolean>(constants.useBoost);
export const setDebugTranslations = setSetting<boolean>(constants.debugTranslations);

export const setUseMwStyleAbilities = setSetting<boolean>(constants.useMwStyleAbilities);
export const setMwHiddenShortNotes = setSetting<string[]>(constants.mwHiddenShortNotes);
export const setMwUseAlternativeItemTypes = setSetting<boolean>(constants.mwUseAlternativeItemTypes);

export const getDefaultGeneralAbilityCategory = () => {
  const cat = getGeneralAbilityCategories()[0];
  if (!cat) {
    throw new Error("No general ability categories found in system settings");
  }
  return cat;
};

export const getDefaultInvestigativeAbilityCategory = () => {
  const cat = getInvestigativeAbilityCategories()[0];
  if (!cat) {
    throw new Error("No investigative ability categories found in system settings");
  }
  return cat;
};
