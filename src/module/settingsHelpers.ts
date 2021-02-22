import * as constants from "../constants";

const getSetting = <T = string>(key: string) => (): T => game.settings.get(constants.systemName, key);
const getListSetting = (key: string) => (): string[] => JSON.parse(getSetting(key)());
const setSetting = <T = string>(key: string) => (value: T) => game.settings.set(constants.systemName, key, value);
const setListSetting = (key: string) => (values: string[]) => game.settings.set(constants.systemName, key, JSON.stringify(values));

export const getSystemMigrationVersion = getSetting(constants.systemMigrationVersion);
export const getDefaultThemeName = getSetting(constants.defaultThemeName);
export const getInvestigativeAbilityCategories = getListSetting(constants.investigativeAbilityCategories);
export const getGeneralAbilityCategories = getListSetting(constants.generalAbilityCategories);
export const getCombatAbilities = getListSetting(constants.combatAbilities);
export const getShortNotes = getListSetting(constants.shortNotes);
export const getLongNotes = getListSetting(constants.longNotes);

export const setSystemMigrationVersion = setSetting(constants.systemMigrationVersion);
export const setDefaultThemeName = setSetting(constants.defaultThemeName);
export const setInvestigativeAbilityCategories = setListSetting(constants.investigativeAbilityCategories);
export const setGeneralAbilityCategories = setListSetting(constants.generalAbilityCategories);
export const setCombatAbilities = setListSetting(constants.combatAbilities);
export const setShortNotes = setListSetting(constants.shortNotes);
export const setLongNotes = setListSetting(constants.longNotes);
