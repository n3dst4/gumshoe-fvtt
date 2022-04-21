import * as c from "./constants";
import { assertGame, mapValues } from "./functions";
import { pathOfCthulhuPreset } from "./presets";
import { ThemeV1 } from "@lumphammer/investigator-fvtt-types";
import { InvestigatorSettingsClass } from "./module/InvestigatorSettingsClass";
import { defaultCustomThemePath, systemName } from "./constants";
import { runtimeConfig } from "./runtime";

// any of these could have an `onChange` added if we wanted to

interface SettingFactoryArgs<T> {
  key: string;
  name: string;
  scope?: "world"|"local";
  config?: boolean;
  choices?: Record<string, string>;
  default: T;
  onChange?: (newVal: T) => void;
}

const getSetting = <T = string>(key: string) => (): T => {
  assertGame(game);
  return game.settings.get(systemName, key) as T;
};

const setSetting = <T = string>(key: string) => (value: T) => {
  assertGame(game);
  return game.settings.set(systemName, key, value);
};

const createSetting = <T>(
  {
    default: _default,
    key,
    name,
    config = false,
    scope = "world",
    choices,
    onChange,
  }: SettingFactoryArgs<T>,
  type: any,
) => {
  Hooks.once("init", () => {
    assertGame(game);
    game.settings.register(c.systemName, key, {
      name,
      scope,
      config,
      default: _default,
      type,
      choices,
      onChange,
    });
  });
  return ({
    key: key,
    get: getSetting<T>(key),
    set: setSetting<T>(key),
  });
};

const createSettingString = (args: SettingFactoryArgs<string>) => (
  createSetting(args, String)
);

const createSettingArray = <T>(args: SettingFactoryArgs<T>) => (
  createSetting(args, Array)
);

const createSettingBoolean = (args: SettingFactoryArgs<boolean>) => (
  createSetting(args, Boolean)
);

const createSettingObject = <T>(args: SettingFactoryArgs<T>) => (
  createSetting<T>(args, Object)
);

export const settings = {
  /**
   * deprecated
   */
  abilityCategories: createSettingString({
    key: "abilityCategories",
    name: "Ability categories",
    default: "Academic,Interpersonal,Technical",
  }),
  systemMigrationVersion: createSettingString({
    key: "systemMigrationVersion",
    name: "System migration version",
    default: c.defaultMigratedSystemVersion,
  }),
  defaultThemeName: createSettingString({
    key: "defaultThemeName",
    name: "Default sheet theme",
    default: pathOfCthulhuPreset.defaultTheme,
    choices: mapValues((theme: ThemeV1) => (theme.displayName), runtimeConfig.themes),
  }),
  investigativeAbilityCategories: createSettingObject({
    key: "investigativeAbilityCategories",
    name: "Investigative ability categories",
    default: pathOfCthulhuPreset.investigativeAbilityCategories,
  }),
  generalAbilityCategories: createSettingObject({
    key: "generalAbilityCategories",
    name: "General ability categories",
    default: pathOfCthulhuPreset.generalAbilityCategories,
  }),
  combatAbilities: createSettingObject({
    key: "combatAbilities",
    name: "Combat abilities",
    default: pathOfCthulhuPreset.combatAbilities,
  }),
  occupationLabel: createSettingString({
    key: "occupationLabel",
    name: "What do we call \"Occupation\"?",
    default: pathOfCthulhuPreset.occupationLabel,
  }),
  shortNotes: createSettingObject({
    key: "shortNotes",
    name: "Short Notes",
    default: pathOfCthulhuPreset.shortNotes,
  }),
  longNotes: createSettingObject({
    key: "longNotes",
    name: "Long Notes",
    default: pathOfCthulhuPreset.longNotes,
  }),
  newPCPacks: createSettingArray({
    key: "newPCPacks",
    name: "Compendium packs for new PCs",
    default: pathOfCthulhuPreset.newPCPacks,
    onChange: (newPacks: string[]) => {
      Hooks.call(c.newPCPacksUpdated, newPacks);
    },
  }),
  newNPCPacks: createSettingArray({
    key: "newNPCPacks",
    name: "Compendium packs for new NPCs",
    default: pathOfCthulhuPreset.newNPCPacks,
    onChange: (newPacks: string[]) => {
      Hooks.call(c.newNPCPacksUpdated, newPacks);
    },
  }),
  systemPreset: createSettingString({
    key: "systemPreset",
    name: "System preset",
    default: "pathOfCthulhuPreset",
  }),
  useBoost: createSettingBoolean({
    key: "useBoost",
    name: "Use Boost",
    default: pathOfCthulhuPreset.useBoost,
  }),
  debugTranslations: createSettingBoolean({
    key: "debugTranslations",
    name: "Debug translations?",
    default: false,
  }),
  useMwStyleAbilities: createSettingBoolean({
    key: "useMwStyleAbilities",
    name: "Use Moribund World-style abilities",
    default: false,
  }),
  mwHiddenShortNotes: createSettingObject<string[]>({
    key: "mwHiddenShortNotes",
    name: "Hidden short notes",
    default: [],
  }),
  mwUseAlternativeItemTypes: createSettingBoolean({
    key: "mwUseAlternativeItemTypes",
    name: "Use alternative item types",
    default: false,
  }),
  useMwInjuryStatus: createSettingBoolean({
    key: "useMwInjuryStatus",
    name: "Use injury status",
    default: false,
  }),
  customThemePath: createSettingString({
    key: "customThemePath",
    name: "Custom theme path",
    default: defaultCustomThemePath,
  }),
  genericOccupation: createSettingString({
    key: "genericOccupation",
    name: "Generic occupation",
    default: "Investigator",
  }),
  showEmptyInvestigativeCategories: createSettingBoolean({
    key: "showEmptyInvestigativeCategories",
    name: "Show empty investigative categories?",
    default: true,
  }),
};

// -----------------------------------------------------------------------------

export const registerSettingsMenu = function () {
  assertGame(game);

  // Define a settings submenu which handles advanced configuration needs
  game.settings.registerMenu(c.systemName, "investigatorSettingsMenu", {
    name: "INVESTIGATOR Settings",
    label: "Open INVESTIGATOR System Settings", // The text label used in the button
    // hint: "A description of what will occur in the submenu dialog.",
    icon: "fas fa-search", // A Font Awesome icon used in the submenu button
    type: InvestigatorSettingsClass, // A FormApplication subclass which should be created
    restricted: true, // Restrict this submenu to gamemaster only?
  });
};

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
