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
  useBoost: boolean,
}

export const trailPreset: SystemPreset = {
  displayName: "Path of Cthulhu",
  defaultTheme: "trailTheme",
  investigativeAbilityCategories: ["Academic", "Interpersonal", "Technical"],
  generalAbilityCategories: ["General"],
  combatAbilities: ["Scuffling", "Weapons", "Firearms", "Athletics"],
  occupationLabel: "Occupation",
  shortNotes: ["Drive"],
  longNotes: ["Notes, Contacts etc.", "Occupational Benefits", "Pillars of Sanity", "Sources of Stability"],
  newPCPacks: [`${systemName}.${packNames.pathOfCthulhuAbilities}`],
  useBoost: false,
};

export const nbaPreset: SystemPreset = {
  displayName: "Nice Black Agents",
  defaultTheme: "nbaTheme",
  investigativeAbilityCategories: ["Academic", "Interpersonal", "Technical"],
  generalAbilityCategories: ["General"],
  combatAbilities: ["Hand-to-Hand", "Weapons", "Shooting", "Athletics"],
  occupationLabel: "Background",
  shortNotes: ["Drive", "Previous Patron"],
  longNotes: ["Covers", "Network Contacts", "Trust"],
  newPCPacks: [`${systemName}.${packNames.niceBlackAgentsAbilities}`],
  useBoost: false,
};

export const fearPreset: SystemPreset = {
  displayName: "Nothing to Fear",
  defaultTheme: "fearTheme",
  investigativeAbilityCategories: ["Academic", "Interpersonal", "Technical", "Psychic Powers"],
  generalAbilityCategories: ["General"],
  combatAbilities: ["Scuffling", "Shooting", "Athletics"],
  occupationLabel: "Concept",
  shortNotes: [],
  longNotes: ["Risk Factors", "Sources of Stability", "Notes"],
  newPCPacks: [`${systemName}.${packNames.nothingToFearAbilities}`],
  useBoost: false,
};

export const ashenPreset: SystemPreset = {
  displayName: "Pallid Stars",
  defaultTheme: "ashenTheme",
  investigativeAbilityCategories: ["Academic", "Interpersonal", "Technical", "Special (vas Mal)"],
  generalAbilityCategories: ["General"],
  combatAbilities: ["Scuffling", "Shooting"],
  occupationLabel: "Species",
  shortNotes: ["Drive", "Groundside Post", "Warpside Post"],
  longNotes: ["Personal Arc", "Cybernetic Enhancements", "Viroware Enhancements", "What You Did During The War"],
  newPCPacks: [`${systemName}.${packNames.pallidStarsAbilities}`],
  useBoost: true,
};

export const systemPresets = {
  trailPreset,
  nbaPreset,
  fearPreset,
  ashenPreset,
};
