import { generalAbility, investigativeAbility } from "../../constants";
import { settings } from "../../settings/settings";
import {
  GeneralAbilityItem,
  InvestigativeAbilityItem,
  isAbilityItem,
} from "../../v10Types";

export const useAbilities = (
  actor: Actor,
  hideZeroRated: boolean,
  hidePushPool: boolean,
) => {
  // why is this a hook? what was I thinking 3 years ago? it's lieterally just
  // a function.

  const investigativeAbilities: {
    [category: string]: InvestigativeAbilityItem[];
  } = {};
  const generalAbilities: { [category: string]: GeneralAbilityItem[] } = {};
  const systemInvestigativeCats = settings.investigativeAbilityCategories.get();
  const systemGeneralCats = settings.generalAbilityCategories.get();
  for (const cat of systemInvestigativeCats) {
    investigativeAbilities[cat] = [];
  }
  for (const cat of systemGeneralCats) {
    generalAbilities[cat] = [];
  }

  for (const item of actor.items.values()) {
    if (!isAbilityItem(item)) {
      continue;
    }
    if (
      hideZeroRated &&
      item.system.hideIfZeroRated &&
      item.system.rating === 0
    ) {
      continue;
    }
    if (item.type === investigativeAbility) {
      const cat = item.system.category || "Uncategorised";
      if (investigativeAbilities[cat] === undefined) {
        investigativeAbilities[cat] = [];
      }
      investigativeAbilities[cat].push(item);
    } else if (item.type === generalAbility) {
      if (hidePushPool && item.system.isPushPool) {
        continue;
      }
      const cat = item.system.category || "Uncategorised";
      if (generalAbilities[cat] === undefined) {
        generalAbilities[cat] = [];
      }
      generalAbilities[cat].push(item);
    }
  }

  return { investigativeAbilities, generalAbilities };
};
