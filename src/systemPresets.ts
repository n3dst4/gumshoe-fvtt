import { packNames, systemName } from "./constants";

export type SystemPreset = {
  defaultTheme: string,
  investigativeAbilityCategories: string[],
  generalAbilityCategories: string[],
  combatAbilities: string[],
  shortNotes: string[],
  longNotes: string[],
  defaultCompendiumPacks: string[],
}

export const trailPreset: SystemPreset = {
  defaultTheme: "trailtheme",
  investigativeAbilityCategories: ["Academic", "Interpersonal", "Technical"],
  generalAbilityCategories: ["General"],
  combatAbilities: ["Scuffling", "Weapons", "Firearms", "Athletics"],
  shortNotes: ["Drive"],
  longNotes: ["Notes, Contacts etc.", "Occupational Benefits", "Pillars of Sanity", "Sources of Stability"],
  defaultCompendiumPacks: [`${systemName}.${packNames.trailOfCthulhuAbilities}`],
};

export const nbaPreset: SystemPreset = {
  defaultTheme: "nbaTheme",
  investigativeAbilityCategories: ["Academic", "Interpersonal", "Technical"],
  generalAbilityCategories: ["General"],
  combatAbilities: ["Scuffling", "Weapons", "Firearms", "Athletics"],
  shortNotes: ["Drive", "Previous Patron"],
  longNotes: ["Covers", "Network Contacts", "Trust"],
  defaultCompendiumPacks: [`${systemName}.${packNames.nightsBlackAgentsAbilities}`],
};

export const systemPresets = {
  trailPreset: trailPreset,
  nbaPreset: nbaPreset,
};
