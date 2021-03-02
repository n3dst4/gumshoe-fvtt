import { packNames, systemName } from "./constants";

export type SystemPreset = {
  displayName: string,
  defaultTheme: string,
  investigativeAbilityCategories: string[],
  generalAbilityCategories: string[],
  combatAbilities: string[],
  occupationLabel: string,
  shortNotes: string[],
  longNotes: string[],
  newPCPacks: string[],
}

export const trailPreset: SystemPreset = {
  displayName: "Trail of Cthulhu",
  defaultTheme: "trailTheme",
  investigativeAbilityCategories: ["Academic", "Interpersonal", "Technical"],
  generalAbilityCategories: ["General"],
  combatAbilities: ["Scuffling", "Weapons", "Firearms", "Athletics"],
  occupationLabel: "Occupation",
  shortNotes: ["Drive"],
  longNotes: ["Notes, Contacts etc.", "Occupational Benefits", "Pillars of Sanity", "Sources of Stability"],
  newPCPacks: [`${systemName}.${packNames.trailOfCthulhuAbilities}`],
};

export const nbaPreset: SystemPreset = {
  displayName: "Night's Black Agents",
  defaultTheme: "nbaTheme",
  investigativeAbilityCategories: ["Academic", "Interpersonal", "Technical"],
  generalAbilityCategories: ["General"],
  combatAbilities: ["Hand-to-Hand", "Weapons", "Shooting", "Athletics"],
  occupationLabel: "Background",
  shortNotes: ["Drive", "Previous Patron"],
  longNotes: ["Covers", "Network Contacts", "Trust"],
  newPCPacks: [`${systemName}.${packNames.nightsBlackAgentsAbilities}`],
};

export const fearPreset: SystemPreset = {
  displayName: "Fear Itself",
  defaultTheme: "fearTheme",
  investigativeAbilityCategories: ["Academic", "Interpersonal", "Technical", "Psychic Powers"],
  generalAbilityCategories: ["General"],
  combatAbilities: ["Scuffling", "Shooting", "Athletics"],
  occupationLabel: "Concept",
  shortNotes: [],
  longNotes: ["Risk Factors", "Sources of Stability", "Notes"],
  newPCPacks: [`${systemName}.${packNames.fearItselfAbilities}`],
};

export const systemPresets = {
  trailPreset: trailPreset,
  nbaPreset: nbaPreset,
  fearpreset: fearPreset,
};
