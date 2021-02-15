import system from "../system.json";
import { abilityCategories, investigativeAbilityCategories } from "../constants";

export const migrateAbilityCategories = async () => {
  // this is also checked at the call site but belt & braces.
  if (!game.user.isGM) return;
  const oldCats = game.settings.get(system.name, abilityCategories);
  if (oldCats) {
    ui.notifications.info("Converting legacy ability categories to investigative ability categories.", { });
    await game.settings.set(system.name, abilityCategories, "");
    await game.settings.set(system.name, investigativeAbilityCategories, oldCats);
  }
};
