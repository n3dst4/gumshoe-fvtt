import * as constants from "../constants";

const getSetting = <T = string>(key: string) => (): T => game.settings.get(constants.systemName, key);
const setSetting = <T = string>(key: string) => (value: T) => game.settings.set(constants.systemName, key, value);

export const getSystemMigrationVersion = getSetting(constants.systemMigrationVersion);
export const getDefaultThemeName = getSetting(constants.defaultThemeName);
export const getInvestigativeAbilityCategories = getSetting<string[]>(constants.investigativeAbilityCategories);
export const getGeneralAbilityCategories = getSetting<string[]>(constants.generalAbilityCategories);
export const getCombatAbilities = getSetting<string[]>(constants.combatAbilities);
export const getShortNotes = getSetting<string[]>(constants.shortNotes);
export const getLongNotes = getSetting<string[]>(constants.longNotes);

export const setSystemMigrationVersion = setSetting(constants.systemMigrationVersion);
export const setDefaultThemeName = setSetting(constants.defaultThemeName);
export const setInvestigativeAbilityCategories = setSetting<string[]>(constants.investigativeAbilityCategories);
export const setGeneralAbilityCategories = setSetting<string[]>(constants.generalAbilityCategories);
export const setCombatAbilities = setSetting<string[]>(constants.combatAbilities);
export const setShortNotes = setSetting<string[]>(constants.shortNotes);
export const setLongNotes = setSetting<string[]>(constants.longNotes);
