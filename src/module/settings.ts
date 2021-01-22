import { abilityCategories } from "../constants";
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
};
