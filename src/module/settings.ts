import { abilityCategories, combatAbilities, defaultTheme } from "../constants";
import { mapValues } from "../functions";
import system from "../system.json";
import { Theme, themes } from "../theme";

export const registerSettings = function () {
  game.settings.register(system.name, abilityCategories, {
    name: "Ability categories",
    hint: "Comma-separated",
    scope: "world",
    config: true,
    default: "Academic,Interpersonal,Technical",
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
};
