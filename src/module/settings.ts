import {
  abilityCategories,
  combatAbilities,
  defaultTheme,
  generalAbilityCategories,
  investigativeAbilityCategories,
  systemMigrationVersion,
} from "../constants";
import { mapValues } from "../functions";
import system from "../system.json";
import { Theme, themes } from "../theme";

export const registerSettings = function () {
  game.settings.register(system.name, systemMigrationVersion, {
    name: "System migration version",
    hint: "",
    scope: "world",
    config: false,
    default: "0.0.0",
    type: String,
    // onChange: enable => _setArchmageInitiative(enable)
  });
  game.settings.register(system.name, abilityCategories, {
    name: "Ability categories",
    hint: "Comma-separated (DNU)",
    scope: "world",
    config: false,
    default: "Academic,Interpersonal,Technical",
    type: String,
    // onChange: enable => _setArchmageInitiative(enable)
  });
  game.settings.register(system.name, investigativeAbilityCategories, {
    name: "Investigative ability categories",
    hint: "Comma-separated",
    scope: "world",
    config: true,
    default: "Academic,Interpersonal,Technical",
    type: String,
    // onChange: enable => _setArchmageInitiative(enable)
  });
  game.settings.register(system.name, generalAbilityCategories, {
    name: "General ability categories",
    hint: "Comma-separated",
    scope: "world",
    config: true,
    default: "General",
    type: String,
    // onChange: enable => _setArchmageInitiative(enable)
  });
  game.settings.register(system.name, combatAbilities, {
    name: "Combat abilities",
    hint: "Comma-separated",
    scope: "world",
    config: true,
    default: "Scuffling,Weapons,Firearms,Athletics",
    type: String,
    // onChange: enable => _setArchmageInitiative(enable)
  });
  game.settings.register(system.name, combatAbilities, {
    name: "Combat abilities",
    hint: "Comma-separated",
    scope: "world",
    config: true,
    default: "Scuffling,Weapons,Firearms,Athletics",
    type: String,
    // onChange: enable => _setArchmageInitiative(enable)
  });
  game.settings.register(system.name, defaultTheme, {
    name: "Default actor sheet theme",
    scope: "world",
    config: true,
    choices: mapValues((theme: Theme) => (theme.displayName), themes),
    default: "trailTheme",
    type: String,
    // onChange: enable => _setArchmageInitiative(enable)
  });
  game.settings.register(system.name, combatAbilities, {
    name: "Combat abilities",
    hint: "Comma-separated",
    scope: "world",
    config: true,
    default: "Scuffling,Weapons,Firearms,Athletics",
    type: String,
    // onChange: enable => _setArchmageInitiative(enable)
  });
  game.settings.register(system.name, "shortNotes", {
    name: "Short Notes",
    hint: "Comma-separated",
    scope: "world",
    config: true,
    default: "Drive",
    type: String,
    // onChange: enable => _setArchmageInitiative(enable)
  });
  game.settings.register(system.name, "longNotes", {
    name: "Short Notes",
    hint: "Comma-separated (backslash to include a comma)",
    scope: "world",
    config: true,
    default: "Notes\\, Contacts etc., Occupational Benefits, Pillars of Sanity, Sources of Stability, Background",
    type: String,
    // onChange: enable => _setArchmageInitiative(enable)
  });
};
