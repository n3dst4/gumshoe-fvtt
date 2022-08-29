import * as c from "./constants";
import { assertGame, mapValues } from "./functions";
import { pathOfCthulhuPreset } from "./presets";
import { SettingsClass } from "./module/SettingsClass";
import { defaultCustomThemePath, systemName } from "./constants";
import { runtimeConfig } from "./runtime";
import { ThemeV1 } from "./themes/types";

// any of these could have an `onChange` added if we wanted to

interface SettingFactoryArgs<T> {
  key: string;
  name: string;
  scope?: "world"|"client";
  config?: boolean;
  choices?: (T extends number | string ? Record<T, string> : never) | undefined;
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
    key,
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
  combatAbilities: createSettingObject({
    key: "combatAbilities",
    name: "Combat abilities",
    default: pathOfCthulhuPreset.combatAbilities,
  }),
  customThemePath: createSettingString({
    key: "customThemePath",
    name: "Custom theme path",
    default: defaultCustomThemePath,
  }),
  debugTranslations: createSettingBoolean({
    key: "debugTranslations",
    name: "Debug translations?",
    default: false,
  }),
  defaultThemeName: createSettingString({
    key: "defaultThemeName",
    name: "Default sheet theme",
    default: pathOfCthulhuPreset.defaultThemeName,
    choices: mapValues((theme: ThemeV1) => theme.displayName, runtimeConfig.themes),
  }),
  generalAbilityCategories: createSettingObject({
    key: "generalAbilityCategories",
    name: "General ability categories",
    default: pathOfCthulhuPreset.generalAbilityCategories,
  }),
  genericOccupation: createSettingString({
    key: "genericOccupation",
    name: "Generic occupation",
    default: pathOfCthulhuPreset.genericOccupation,
  }),
  investigativeAbilityCategories: createSettingObject({
    key: "investigativeAbilityCategories",
    name: "Investigative ability categories",
    default: pathOfCthulhuPreset.investigativeAbilityCategories,
  }),
  longNotes: createSettingObject({
    key: "longNotes",
    name: "Long Notes",
    default: pathOfCthulhuPreset.longNotes,
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
  newNPCPacks: createSettingArray({
    key: "newNPCPacks",
    name: "Compendium packs for new NPCs",
    default: pathOfCthulhuPreset.newNPCPacks,
    onChange: (newPacks: string[]) => {
      Hooks.call(c.newNPCPacksUpdated, newPacks);
    },
  }),
  newPCPacks: createSettingArray({
    key: "newPCPacks",
    name: "Compendium packs for new PCs",
    default: pathOfCthulhuPreset.newPCPacks,
    onChange: (newPacks: string[]) => {
      Hooks.call(c.newPCPacksUpdated, newPacks);
    },
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
  showEmptyInvestigativeCategories: createSettingBoolean({
    key: "showEmptyInvestigativeCategories",
    name: "Show empty investigative categories?",
    default: true,
  }),
  systemMigrationVersion: createSettingString({
    key: "systemMigrationVersion",
    name: "System migration version",
    default: c.defaultMigratedSystemVersion,
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
  useMwInjuryStatus: createSettingBoolean({
    key: "useMwInjuryStatus",
    name: "Use injury status",
    default: false,
  }),
  useMwStyleAbilities: createSettingBoolean({
    key: "useMwStyleAbilities",
    name: "Use Moribund World-style abilities",
    default: false,
  }),
  pcStats: createSettingObject({
    key: "pcStats",
    name: "What stats should PCs have?",
    default: pathOfCthulhuPreset.pcStats,
  }),
  npcStats: createSettingObject({
    key: "npcStats",
    name: "What stats should NPCs have?",
    default: pathOfCthulhuPreset.npcStats,
  }),
  useNpcCombatBonuses: createSettingBoolean({
    key: "useNpcCombatBonuses",
    name: "Use NPC Combat Bonuses?",
    default: pathOfCthulhuPreset.useNpcCombatBonuses,
  }),
  useTurnPassingInitiative: createSettingBoolean({
    key: "useTurnPassingInitiative",
    name: "Use turn-passing initiative?",
    default: pathOfCthulhuPreset.useNpcCombatBonuses,
  }),
  equipmentCategories: createSettingObject({
    key: "equipmentCategories",
    name: "Equipment categories",
    default: pathOfCthulhuPreset.equipmentCategories,
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
    type: SettingsClass, // A FormApplication subclass which should be created
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

export type SettingsDict = { [Property in keyof typeof settings]: ReturnType<(typeof settings)[Property]["get"]> };

export const getSettingsDict = () => (
  mapValues((x) => x.get(), settings) as SettingsDict
);
