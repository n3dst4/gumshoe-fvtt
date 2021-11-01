import { generalAbility, investigativeAbility } from "../../constants";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { getGeneralAbilityCategories, getInvestigativeAbilityCategories } from "../../settingsHelpers";
import { isAbilityDataSource } from "../../types";

export const useAbilities = (actor: Actor, hideZeroRated: boolean) => {
  const investigativeAbilities: { [category: string]: InvestigatorItem[] } = {};
  const generalAbilities: { [category: string]: InvestigatorItem[] } = {};
  const systemInvestigativeCats = getInvestigativeAbilityCategories();
  const systemGeneralCats = getGeneralAbilityCategories();
  for (const cat of systemInvestigativeCats) {
    investigativeAbilities[cat] = [];
  }
  for (const cat of systemGeneralCats) {
    generalAbilities[cat] = [];
  }

  for (const item of actor.items.values()) {
    if (!isAbilityDataSource(item.data)) {
      continue;
    }
    if (hideZeroRated && item.data.data.hideIfZeroRated && item.data.data.rating === 0) {
      continue;
    }
    if (item.data.type === investigativeAbility) {
      const cat = item.data.data.category || "Uncategorised";
      if (investigativeAbilities[cat] === undefined) {
        investigativeAbilities[cat] = [];
      }
      investigativeAbilities[cat].push(item);
    } else if (item.type === generalAbility) {
      const cat = item.data.data.category || "Uncategorised";
      if (generalAbilities[cat] === undefined) {
        generalAbilities[cat] = [];
      }
      generalAbilities[cat].push(item);
    }
  }

  return { investigativeAbilities, generalAbilities };
};
