import {
  abilityCategories,
  combatAbilities,
  defaultMigratedSystemVersion,
  defaultThemeName,
  generalAbilityCategories,
  investigativeAbilityCategories,
  longNotes,
  shortNotes,
  systemMigrationVersion,
  systemPreset,
} from "../constants";
import { mapValues } from "../functions";
import system from "../system.json";
import { Theme, themes } from "../theme";
import { GumshoeSettingsClass } from "./GumshoeSettingsClass";

export const registerSettings = function () {
  // this is legacy
  game.settings.register(system.name, abilityCategories, {
    name: "Ability categories",
    hint: "Comma-separated (DNU)",
    scope: "world",
    config: false,
    default: "Academic,Interpersonal,Technical",
    type: String,
    // onChange: enable => {}
  });

  game.settings.register(system.name, systemMigrationVersion, {
    name: "System migration version",
    hint: "",
    scope: "world",
    config: false,
    default: defaultMigratedSystemVersion,
    type: String,
    // onChange: enable => {}
  });
  game.settings.register(system.name, defaultThemeName, {
    name: "Default sheet theme",
    scope: "world",
    config: false,
    choices: mapValues((theme: Theme) => (theme.displayName), themes),
    default: "trailTheme",
    type: String,
    // onChange: enable => {}
  });

  game.settings.register(system.name, investigativeAbilityCategories, {
    name: "Investigative ability categories",
    hint: "Comma-separated",
    scope: "world",
    config: false,
    default: ["Academic", "Interpersonal", "Technical"],
    type: Object,
    // onChange: enable => {}
  });
  game.settings.register(system.name, generalAbilityCategories, {
    name: "General ability categories",
    hint: "Comma-separated",
    scope: "world",
    config: false,
    default: ["General"],
    type: Object,
    // onChange: enable => {}
  });
  game.settings.register(system.name, combatAbilities, {
    name: "Combat abilities",
    hint: "Comma-separated",
    scope: "world",
    config: false,
    default: ["Scuffling", "Weapons", "Firearms", "Athletics"],
    type: Object,
    // onChange: enable => {}
  });
  game.settings.register(system.name, shortNotes, {
    name: "Short Notes",
    hint: "Comma-separated",
    scope: "world",
    config: false,
    default: ["Drive"],
    type: Object,
    // onChange: enable => {}
  });
  game.settings.register(system.name, longNotes, {
    name: "Long Notes",
    hint: "Comma-separated (backslash to include a comma)",
    scope: "world",
    config: false,
    default: ["Notes, Contacts etc.", "Occupational Benefits", "Pillars of Sanity", "Sources of Stability", "Background"],
    type: Object,
    // onChange: enable => {}
  });

  game.settings.register(system.name, systemPreset, {
    name: "System preset",
    hint: "",
    scope: "world",
    config: false,
    default: defaultMigratedSystemVersion,
    type: String,
    // onChange: enable => {}
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
