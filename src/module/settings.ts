import {
  abilityCategories,
  combatAbilities,
  defaultMigratedSystemVersion,
  defaultThemeName,
  generalAbilityCategories,
  investigativeAbilityCategories,
  longNotes,
  newPCPacks,
  occupationLabel,
  shortNotes,
  systemMigrationVersion,
  systemName,
  systemPreset,
  useBoost,
} from "../constants";
import { mapValues } from "../functions";
import { trailPreset } from "../systemPresets";
import { Theme, themes } from "../theme";
import { GumshoeSettingsClass } from "./GumshoeSettingsClass";

// any of these could have an `onChange` added if we wanted to

export const registerSettings = function () {
  // this is legacy
  game.settings.register(systemName, abilityCategories, {
    name: "Ability categories",
    hint: "Comma-separated (DNU)",
    scope: "world",
    config: false,
    default: "Academic,Interpersonal,Technical",
    type: String,
  });

  game.settings.register(systemName, systemMigrationVersion, {
    name: "System migration version",
    hint: "",
    scope: "world",
    config: false,
    default: defaultMigratedSystemVersion,
    type: String,
  });
  game.settings.register(systemName, defaultThemeName, {
    name: "Default sheet theme",
    scope: "world",
    config: false,
    choices: mapValues((theme: Theme) => (theme.displayName), themes),
    default: trailPreset.defaultTheme,
    type: String,
  });

  game.settings.register(systemName, investigativeAbilityCategories, {
    name: "Investigative ability categories",
    scope: "world",
    config: false,
    default: trailPreset.investigativeAbilityCategories,
    type: Object,
  });
  game.settings.register(systemName, generalAbilityCategories, {
    name: "General ability categories",
    scope: "world",
    config: false,
    default: trailPreset.generalAbilityCategories,
    type: Object,
  });
  game.settings.register(systemName, combatAbilities, {
    name: "Combat abilities",
    scope: "world",
    config: false,
    default: trailPreset.combatAbilities,
    type: Object,
  });
  game.settings.register(systemName, occupationLabel, {
    name: "What do we call \"Occupation\"?",
    scope: "world",
    config: false,
    default: trailPreset.occupationLabel,
    type: String,
  });
  game.settings.register(systemName, shortNotes, {
    name: "Short Notes",
    scope: "world",
    config: false,
    default: trailPreset.shortNotes,
    type: Object,
  });
  game.settings.register(systemName, longNotes, {
    name: "Long Notes",
    scope: "world",
    config: false,
    default: trailPreset.longNotes,
    type: Object,
  });

  game.settings.register(systemName, newPCPacks, {
    name: "Compendium packs for new PCs",
    scope: "world",
    config: false,
    default: trailPreset.newPCPacks,
    type: Object,
  });

  game.settings.register(systemName, systemPreset, {
    name: "System preset",
    hint: "",
    scope: "world",
    config: false,
    default: "trailPreset",
    type: String,
  });

  game.settings.register(systemName, useBoost, {
    name: "Use Boost",
    hint: "",
    scope: "world",
    config: false,
    default: trailPreset.useBoost,
    type: Boolean,
  });

  // Define a settings submenu which handles advanced configuration needs
  game.settings.registerMenu(systemName, "gumshoeSettingsMenu", {
    name: "GUMSHOE Settings",
    label: "Open GUMSHOE System Settings", // The text label used in the button
    // hint: "A description of what will occur in the submenu dialog.",
    icon: "fas fa-search", // A Font Awesome icon used in the submenu button
    type: GumshoeSettingsClass, // A FormApplication subclass which should be created
    restricted: true, // Restrict this submenu to gamemaster only?
  });
};
