import { generalAbility, investigativeAbility } from "../../constants";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { settings } from "../../settings/settings";
import { isAbilityItem } from "../../v10Types";

export const useAbilities = (actor: Actor, hideZeroRated: boolean) => {
  const investigativeAbilities: { [category: string]: InvestigatorItem[] } = {};
  const generalAbilities: { [category: string]: InvestigatorItem[] } = {};
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
      const cat = item.system.category || "Uncategorised";
      if (generalAbilities[cat] === undefined) {
        generalAbilities[cat] = [];
      }
      generalAbilities[cat].push(item);
    }
  }

  return { investigativeAbilities, generalAbilities };
};
