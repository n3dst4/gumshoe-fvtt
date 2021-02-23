import {
  abilityCategories,
  combatAbilities,
  defaultMigratedSystemVersion,
  defaultThemeName,
  generalAbilityCategories,
  investigativeAbilityCategories,
  longNotes,
  newPCPacks,
  packNames,
  shortNotes,
  systemMigrationVersion,
  systemName,
  systemPreset,
} from "../constants";
import { mapValues } from "../functions";
import system from "../system.json";
import { Theme, themes } from "../theme";
import { GumshoeSettingsClass } from "./GumshoeSettingsClass";

// any of these could have an `onChange` added if we wanted to

export const registerSettings = function () {
  // this is legacy
  game.settings.register(system.name, abilityCategories, {
    name: "Ability categories",
    hint: "Comma-separated (DNU)",
    scope: "world",
    config: false,
    default: "Academic,Interpersonal,Technical",
    type: String,
  });

  game.settings.register(system.name, systemMigrationVersion, {
    name: "System migration version",
    hint: "",
    scope: "world",
    config: false,
    default: defaultMigratedSystemVersion,
    type: String,
  });
  game.settings.register(system.name, defaultThemeName, {
    name: "Default sheet theme",
    scope: "world",
    config: false,
    choices: mapValues((theme: Theme) => (theme.displayName), themes),
    default: "trailTheme",
    type: String,
  });

  game.settings.register(system.name, investigativeAbilityCategories, {
    name: "Investigative ability categories",
    scope: "world",
    config: false,
    default: ["Academic", "Interpersonal", "Technical"],
    type: Object,
  });
  game.settings.register(system.name, generalAbilityCategories, {
    name: "General ability categories",
    scope: "world",
    config: false,
    default: ["General"],
    type: Object,
  });
  game.settings.register(system.name, combatAbilities, {
    name: "Combat abilities",
    scope: "world",
    config: false,
    default: ["Scuffling", "Weapons", "Firearms", "Athletics"],
    type: Object,
  });
  game.settings.register(system.name, shortNotes, {
    name: "Short Notes",
    scope: "world",
    config: false,
    default: ["Drive"],
    type: Object,
  });
  game.settings.register(system.name, longNotes, {
    name: "Long Notes",
    scope: "world",
    config: false,
    default: ["Notes, Contacts etc.", "Occupational Benefits", "Pillars of Sanity", "Sources of Stability", "Background"],
    type: Object,
  });

  game.settings.register(system.name, newPCPacks, {
    name: "Compendium packs for new PCs",
    scope: "world",
    config: false,
    default: [`${systemName}.${packNames.trailOfCthulhuAbilities}`],
    type: Object,
  });

  game.settings.register(system.name, systemPreset, {
    name: "System preset",
    hint: "",
    scope: "world",
    config: false,
    default: "trailPreset",
    type: String,
  });

  // Define a settings submenu which handles advanced configuration needs
  game.settings.registerMenu(system.name, "gumshoeSettingsMenu", {
    name: "GUMSHOE Settings",
    label: "Open GUMSHOE System Settings", // The text label used in the button
    // hint: "A description of what will occur in the submenu dialog.",
    icon: "fas fa-search", // A Font Awesome icon used in the submenu button
    type: GumshoeSettingsClass, // A FormApplication subclass which should be created
    restricted: true, // Restrict this submenu to gamemaster only?
  });
};
