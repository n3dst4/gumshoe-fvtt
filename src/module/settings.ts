import { abilityCategories, combatAbilities, defaultTheme } from "../constants";
import system from "../system.json";

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
    choices: {
      trailTheme: "Trail of Cthulhu",
      nightsTheme: "Night Black Agents",
    },
    default: "trailTheme",
    type: String,
    // onChange: enable => _setArchmageInitiative(enable)
  });
};
