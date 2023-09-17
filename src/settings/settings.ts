import * as c from "../constants";
import { mapValues } from "../functions/utilities";
import { MigrationFlags } from "../migrations/types";
import { pathOfCthulhuPreset } from "../presets";
import { runtimeConfig } from "../runtime";
import { ThemeV1 } from "../themes/types";
import {
  createSettingArrayOfString,
  createSettingBoolean,
  createSettingObject,
  createSettingString,
} from "./createSettings";
import { equipmentCategoriesValidator } from "./validators/equipmentCategoriesValidator";
import { personalDetailsValidator } from "./validators/personalDetailsValidator";
import { statsValidator } from "./validators/statsValidator";

// any of these could have an `onChange` added if we wanted to

// const mySchema = z.string();

export const settings = {
  /**
   * @deprecated
   */
  abilityCategories: createSettingString({
    key: "abilityCategories",
    name: "Ability categories",
    default: "Academic,Interpersonal,Technical",
  }),
  combatAbilities: createSettingArrayOfString({
    key: "combatAbilities",
    name: "Combat abilities",
    default: pathOfCthulhuPreset.combatAbilities,
  }),
  customThemePath: createSettingString({
    key: "customThemePath",
    name: "Custom theme path",
    default: c.defaultCustomThemePath,
    exportable: false as const,
  }),
  debugTranslations: createSettingBoolean({
    key: "debugTranslations",
    name: "Debug translations?",
    default: false,
    exportable: false,
  }),
  defaultThemeName: createSettingString({
    key: "defaultThemeName",
    name: "Default sheet theme",
    default: pathOfCthulhuPreset.defaultThemeName,
    choices: mapValues(
      (theme: ThemeV1) => theme.displayName,
      runtimeConfig.themes,
    ),
  }),
  generalAbilityCategories: createSettingArrayOfString({
    key: "generalAbilityCategories",
    name: "General ability categories",
    default: pathOfCthulhuPreset.generalAbilityCategories,
  }),
  genericOccupation: createSettingString({
    key: "genericOccupation",
    name: "Generic occupation",
    default: pathOfCthulhuPreset.genericOccupation,
  }),
  investigativeAbilityCategories: createSettingArrayOfString({
    key: "investigativeAbilityCategories",
    name: "Investigative ability categories",
    default: pathOfCthulhuPreset.investigativeAbilityCategories,
  }),
  longNotes: createSettingArrayOfString({
    key: "longNotes",
    name: "Long Notes",
    default: pathOfCthulhuPreset.longNotes,
  }),
  mwHiddenShortNotes: createSettingArrayOfString({
    key: "mwHiddenShortNotes",
    name: "Hidden short notes",
    default: [],
  }),
  mwUseAlternativeItemTypes: createSettingBoolean({
    key: "mwUseAlternativeItemTypes",
    name: "Use alternative item types",
    default: false,
  }),
  newNPCPacks: createSettingArrayOfString({
    key: "newNPCPacks",
    name: "Compendium packs for new NPCs",
    default: pathOfCthulhuPreset.newNPCPacks,
    onChange: (newPacks: string[]) => {
      Hooks.call(c.newNPCPacksUpdated, newPacks);
    },
  }),
  newPCPacks: createSettingArrayOfString({
    key: "newPCPacks",
    name: "Compendium packs for new PCs",
    default: pathOfCthulhuPreset.newPCPacks,
    onChange: (newPacks: string[]) => {
      Hooks.call(c.newPCPacksUpdated, newPacks);
    },
  }),
  occupationLabel: createSettingString({
    key: "occupationLabel",
    name: 'What do we call "Occupation"?',
    default: pathOfCthulhuPreset.occupationLabel,
  }),
  /**
   * @deprecated
   * Use personalDetails instead
   */
  shortNotes: createSettingObject({
    key: "shortNotes",
    name: "Short Notes",
    default: [""],
    exportable: false,
  }),
  personalDetails: createSettingObject({
    key: "personalDetails",
    name: "Personal details",
    default: pathOfCthulhuPreset.personalDetails,
    validator: personalDetailsValidator,
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
    exportable: false,
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
    validator: statsValidator,
  }),
  npcStats: createSettingObject({
    key: "npcStats",
    name: "What stats should NPCs have?",
    default: pathOfCthulhuPreset.npcStats,
    validator: statsValidator,
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
    validator: equipmentCategoriesValidator,
  }),
  migrationFlags: createSettingObject<MigrationFlags>({
    key: "migrationFlags",
    name: "Migration flags",
    default: {
      actor: {},
      item: {},
      compendium: {},
      journal: {},
      macro: {},
      scene: {},
      rollTable: {},
      playlist: {},
      world: {},
    },
    exportable: false,
  }),
  firstRun: createSettingBoolean({
    key: "firstRun",
    name: "First run?",
    default: true,
    exportable: false,
  }),
};

// -----------------------------------------------------------------------------

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
    throw new Error(
      "No investigative ability categories found in system settings",
    );
  }
  return cat;
};

export type SettingsDict = {
  [Property in keyof typeof settings]: ReturnType<
    (typeof settings)[Property]["get"]
  >;
};

export const getSettingsDict = () =>
  mapValues((x) => x.get(), settings) as SettingsDict;
