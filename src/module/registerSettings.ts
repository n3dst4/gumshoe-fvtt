import * as c from "../constants";
import { assertGame, mapValues } from "../functions";
import { pathOfCthulhuPreset } from "../systemPresets";
import { themes } from "../themes/themes";
import { Theme } from "../themes/types";
import { InvestigatorSettingsClass } from "./InvestigatorSettingsClass";

// any of these could have an `onChange` added if we wanted to

export const registerSettings = function () {
  assertGame(game);

  // this is legacy
  game.settings.register(c.systemName, c.abilityCategories, {
    name: "Ability categories",
    hint: "Comma-separated (DNU)",
    scope: "world",
    config: false,
    default: "Academic,Interpersonal,Technical",
    type: String,
  });

  game.settings.register(c.systemName, c.systemMigrationVersion, {
    name: "System migration version",
    hint: "",
    scope: "world",
    config: false,
    default: c.defaultMigratedSystemVersion,
    type: String,
  });
  game.settings.register(c.systemName, c.defaultThemeName, {
    name: "Default sheet theme",
    scope: "world",
    config: false,
    choices: mapValues((theme: Theme) => (theme.displayName), themes),
    default: pathOfCthulhuPreset.defaultTheme,
    type: String,
  });

  game.settings.register(c.systemName, c.investigativeAbilityCategories, {
    name: "Investigative ability categories",
    scope: "world",
    config: false,
    default: pathOfCthulhuPreset.investigativeAbilityCategories,
    type: Object,
  });
  game.settings.register(c.systemName, c.generalAbilityCategories, {
    name: "General ability categories",
    scope: "world",
    config: false,
    default: pathOfCthulhuPreset.generalAbilityCategories,
    type: Object,
  });
  game.settings.register(c.systemName, c.combatAbilities, {
    name: "Combat abilities",
    scope: "world",
    config: false,
    default: pathOfCthulhuPreset.combatAbilities,
    type: Object,
  });
  game.settings.register(c.systemName, c.occupationLabel, {
    name: "What do we call \"Occupation\"?",
    scope: "world",
    config: false,
    default: pathOfCthulhuPreset.occupationLabel,
    type: String,
  });
  game.settings.register(c.systemName, c.shortNotes, {
    name: "Short Notes",
    scope: "world",
    config: false,
    default: pathOfCthulhuPreset.shortNotes,
    type: Object,
  });
  game.settings.register(c.systemName, c.longNotes, {
    name: "Long Notes",
    scope: "world",
    config: false,
    default: pathOfCthulhuPreset.longNotes,
    type: Object,
  });

  game.settings.register(c.systemName, c.newPCPacks, {
    name: "Compendium packs for new PCs",
    scope: "world",
    config: false,
    default: pathOfCthulhuPreset.newPCPacks,
    type: Array,
    onChange: (newPacks: string[]) => {
      Hooks.call(c.newPCPacksUpdated, newPacks);
    },
  });

  game.settings.register(c.systemName, c.newNPCPacks, {
    name: "Compendium packs for new NPCs",
    scope: "world",
    config: false,
    default: pathOfCthulhuPreset.newNPCPacks,
    type: Array,
    onChange: (newPacks: string[]) => {
      Hooks.call(c.newNPCPacksUpdated, newPacks);
    },
  });

  game.settings.register(c.systemName, c.systemPreset, {
    name: "System preset",
    hint: "",
    scope: "world",
    config: false,
    default: "pathOfCthulhuPreset",
    type: String,
  });

  game.settings.register(c.systemName, c.useBoost, {
    name: "Use Boost",
    hint: "",
    scope: "world",
    config: false,
    default: pathOfCthulhuPreset.useBoost,
    type: Boolean,
  });

  game.settings.register(c.systemName, c.debugTranslations, {
    name: "Debug translations?",
    hint: "",
    scope: "local",
    config: false,
    default: false,
    type: Boolean,
  });

  game.settings.register(c.systemName, c.useMwStyleAbilities, {
    name: "Use Moribund World-style abilities",
    hint: "",
    scope: "world",
    config: false,
    default: false,
    type: Boolean,
  });

  game.settings.register(c.systemName, c.mwHiddenShortNotes, {
    name: "Hidden short notes",
    hint: "",
    scope: "world",
    config: false,
    default: [],
    type: Object,
  });

  game.settings.register(c.systemName, c.mwUseAlternativeItemTypes, {
    name: "Use alternative item types",
    hint: "",
    scope: "world",
    config: false,
    default: false,
    type: Boolean,
  });

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
