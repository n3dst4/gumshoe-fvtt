import { z } from "zod";

import * as c from "./constants";
import { defaultCustomThemePath, systemId } from "./constants";
import { assertGame, mapValues } from "./functions/utilities";
import { MigrationFlags } from "./migrations/types";
import { pathOfCthulhuPreset } from "./presets";
import { runtimeConfig } from "./runtime";
import { ThemeV1 } from "./themes/types";

// any of these could have an `onChange` added if we wanted to

// const mySchema = z.string();

interface SettingFactoryArgs<T> {
  key: string;
  name: string;
  scope?: "world" | "client";
  config?: boolean;
  choices?: (T extends number | string ? Record<T, string> : never) | undefined;
  default: T;
  onChange?: (newVal: T) => void;
  exportable?: boolean;
  validator?: z.ZodTypeAny;
}

const getSetting =
  <T = string>(key: string) =>
  (): T => {
    assertGame(game);
    return game.settings.get(systemId, key) as T;
  };

const setSetting =
  <T = string>(key: string) =>
  (value: T) => {
    assertGame(game);
    return game.settings.set(systemId, key, value);
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
    exportable = true,
    validator,
  }: SettingFactoryArgs<T>,
  type: any,
  defaultValidator?: z.ZodTypeAny,
) => {
  Hooks.once("init", () => {
    assertGame(game);
    game.settings.register(c.systemId, key, {
      name,
      scope,
      config,
      default: _default,
      type,
      choices,
      onChange,
    });
  });
  return {
    key,
    get: getSetting<T>(key),
    set: setSetting<T>(key),
    exportable,
    validator: validator ?? defaultValidator,
  };
};

export const createSettingString = (args: SettingFactoryArgs<string>) =>
  createSetting(args, String, z.string());

export const createSettingArrayOfString = (
  args: SettingFactoryArgs<string[]>,
) => createSetting(args, Array, z.array(z.string()));

export const createSettingBoolean = (args: SettingFactoryArgs<boolean>) =>
  createSetting(args, Boolean, z.boolean());

export const createSettingObject = <T>(args: SettingFactoryArgs<T>) =>
  createSetting<T>(args, Object, z.object({}).catchall(z.any()));

const statsValidator = z.record(
  z.object({ name: z.string(), default: z.number() }),
);

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
    default: defaultCustomThemePath,
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
    validator: z.array(
      z.object({
        name: z.string(),
        type: z.enum(["text", "item"]),
      }),
    ),
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
    validator: z.record(
      z.object({
        name: z.string(),
        fields: z.record(
          z
            .object({
              name: z.string(),
            })
            .and(
              z.discriminatedUnion("type", [
                z.object({
                  type: z.literal("string"),
                  default: z.string(),
                }),
                z.object({
                  type: z.literal("number"),
                  default: z.number(),
                  min: z.number().optional(),
                  max: z.number().optional(),
                }),
                z.object({
                  type: z.literal("checkbox"),
                  default: z.boolean(),
                }),
              ]),
            ),
        ),
      }),
    ),
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
