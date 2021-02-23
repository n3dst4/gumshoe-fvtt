import { packNames, systemName } from "./constants";

export type SystemPreset = {
  displayName: string,
  defaultTheme: string,
  investigativeAbilityCategories: string[],
  generalAbilityCategories: string[],
  combatAbilities: string[],
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
  shortNotes: ["Drive"],
  longNotes: ["Notes, Contacts etc.", "Occupational Benefits", "Pillars of Sanity", "Sources of Stability"],
  newPCPacks: [`${systemName}.${packNames.trailOfCthulhuAbilities}`],
};

export const nbaPreset: SystemPreset = {
  displayName: "Night's Black Agents",
  defaultTheme: "nbaTheme",
  investigativeAbilityCategories: ["Academic", "Interpersonal", "Technical"],
  generalAbilityCategories: ["General"],
  combatAbilities: ["Scuffling", "Weapons", "Firearms", "Athletics"],
  shortNotes: ["Drive", "Previous Patron"],
  longNotes: ["Covers", "Network Contacts", "Trust"],
  newPCPacks: [`${systemName}.${packNames.nightsBlackAgentsAbilities}`],
};

export const systemPresets = {
  trailPreset: trailPreset,
  nbaPreset: nbaPreset,
};
