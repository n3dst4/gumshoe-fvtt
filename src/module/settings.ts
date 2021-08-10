import {
  abilityCategories,
  combatAbilities,
  debugTranslations,
  defaultMigratedSystemVersion,
  defaultThemeName,
  generalAbilityCategories,
  investigativeAbilityCategories,
  longNotes,
  newPCPacks,
  newPCPacksUpdated,
  occupationLabel,
  shortNotes,
  systemMigrationVersion,
  systemName,
  systemPreset,
  useBoost,
} from "../constants";
import { assertGame, mapValues } from "../functions";
import { pathOfCthulhuPreset } from "../systemPresets";
import { Theme, themes } from "../theme";
import { GumshoeSettingsClass } from "./GumshoeSettingsClass";

// any of these could have an `onChange` added if we wanted to

export const registerSettings = function () {
  assertGame(game);
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
    default: pathOfCthulhuPreset.defaultTheme,
    type: String,
  });

  game.settings.register(systemName, investigativeAbilityCategories, {
    name: "Investigative ability categories",
    scope: "world",
    config: false,
    default: pathOfCthulhuPreset.investigativeAbilityCategories,
    type: Object,
  });
  game.settings.register(systemName, generalAbilityCategories, {
    name: "General ability categories",
    scope: "world",
    config: false,
    default: pathOfCthulhuPreset.generalAbilityCategories,
    type: Object,
  });
  game.settings.register(systemName, combatAbilities, {
    name: "Combat abilities",
    scope: "world",
    config: false,
    default: pathOfCthulhuPreset.combatAbilities,
    type: Object,
  });
  game.settings.register(systemName, occupationLabel, {
    name: "What do we call \"Occupation\"?",
    scope: "world",
    config: false,
    default: pathOfCthulhuPreset.occupationLabel,
    type: String,
  });
  game.settings.register(systemName, shortNotes, {
    name: "Short Notes",
    scope: "world",
    config: false,
    default: pathOfCthulhuPreset.shortNotes,
    type: Object,
  });
  game.settings.register(systemName, longNotes, {
    name: "Long Notes",
    scope: "world",
    config: false,
    default: pathOfCthulhuPreset.longNotes,
    type: Object,
  });

  game.settings.register(systemName, newPCPacks, {
    name: "Compendium packs for new PCs",
    scope: "world",
    config: false,
    default: pathOfCthulhuPreset.newPCPacks,
    type: Object,
    onChange: (newPacks: string[]) => {
      Hooks.call(newPCPacksUpdated, newPacks);
    },
  });

  game.settings.register(systemName, systemPreset, {
    name: "System preset",
    hint: "",
    scope: "world",
    config: false,
    default: "pathOfCthulhuPreset",
    type: String,
  });

  game.settings.register(systemName, useBoost, {
    name: "Use Boost",
    hint: "",
    scope: "world",
    config: false,
    default: pathOfCthulhuPreset.useBoost,
    type: Boolean,
  });

  game.settings.register(systemName, debugTranslations, {
    name: "Debug translations?",
    hint: "",
    scope: "local",
    config: false,
    default: false,
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
