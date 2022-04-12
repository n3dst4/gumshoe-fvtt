import { PresetV1 } from "@lumphammer/investigator-fvtt-types";
import { packNames, systemName, npcPackName } from "./constants";

export const pathOfCthulhuPreset: PresetV1 = {
  schemaVersion: "v1",
  displayName: "Path of Cthulhu",
  defaultTheme: "tealTheme",
  investigativeAbilityCategories: ["Academic", "Interpersonal", "Technical"],
  generalAbilityCategories: ["General"],
  combatAbilities: ["Scuffling", "Weapons", "Firearms", "Athletics"],
  occupationLabel: "Occupation",
  shortNotes: ["Drive"],
  longNotes: ["Notes, Contacts etc.", "Occupational Benefits", "Pillars of Sanity", "Sources of Stability"],
  newPCPacks: [`${systemName}.${packNames.pathOfCthulhuAbilities}`],
  newNPCPacks: [`${systemName}.${npcPackName}`],
  useBoost: false,
  useMwStyleAbilities: false,
  mwUseAlternativeItemTypes: false,
};

export const niceBlackAgentsPreset: PresetV1 = {
  schemaVersion: "v1",
  displayName: "Nice Black Agents",
  defaultTheme: "niceTheme",
  investigativeAbilityCategories: ["Academic", "Interpersonal", "Technical"],
  generalAbilityCategories: ["General"],
  combatAbilities: ["Hand-to-Hand", "Weapons", "Shooting", "Athletics"],
  occupationLabel: "Background",
  shortNotes: ["Drive", "Previous Patron"],
  longNotes: ["Covers", "Network Contacts", "Trust"],
  newPCPacks: [`${systemName}.${packNames.niceBlackAgentsAbilities}`],
  newNPCPacks: [`${systemName}.${npcPackName}`],
  useBoost: false,
  useMwStyleAbilities: false,
  mwUseAlternativeItemTypes: false,
};

export const nothingToFearPreset: PresetV1 = {
  schemaVersion: "v1",
  displayName: "Nothing to Fear",
  defaultTheme: "fearTheme",
  investigativeAbilityCategories: ["Academic", "Interpersonal", "Technical", "Psychic Powers"],
  generalAbilityCategories: ["General"],
  combatAbilities: ["Scuffling", "Shooting", "Athletics"],
  occupationLabel: "Concept",
  shortNotes: [],
  longNotes: ["Risk Factors", "Sources of Stability", "Notes"],
  newPCPacks: [`${systemName}.${packNames.nothingToFearAbilities}`],
  newNPCPacks: [`${systemName}.${npcPackName}`],
  useBoost: false,
  useMwStyleAbilities: false,
  mwUseAlternativeItemTypes: false,
};

export const pallidStarsPreset: PresetV1 = {
  schemaVersion: "v1",
  displayName: "Pallid Stars",
  defaultTheme: "pallidTheme",
  investigativeAbilityCategories: ["Academic", "Interpersonal", "Technical", "Special"],
  generalAbilityCategories: ["General"],
  combatAbilities: ["Scuffling", "Shooting"],
  occupationLabel: "Species",
  shortNotes: ["Drive", "Groundside Post", "Warpside Post"],
  longNotes: ["Personal Arc", "Cybernetic Enhancements", "Viroware Enhancements", "What You Did During The War"],
  newPCPacks: [`${systemName}.${packNames.pallidStarsAbilities}`],
  newNPCPacks: [`${systemName}.${npcPackName}`],
  useBoost: true,
  useMwStyleAbilities: false,
  mwUseAlternativeItemTypes: false,
};

export const castingTheRunesPreset: PresetV1 = {
  schemaVersion: "v1",
  displayName: "Casting the Runes",
  defaultTheme: "antiquarianTheme",
  investigativeAbilityCategories: ["Academic", "Interpersonal", "Technical"],
  generalAbilityCategories: ["General"],
  combatAbilities: ["Scuffling", "Weapons"],
  occupationLabel: "Occupation",
  shortNotes: ["Drive"],
  longNotes: ["Income", "Contacts", "Magic", "Sources of Stability", "Things Encountered"],
  newPCPacks: [`${systemName}.${packNames.castingTheRunesAbilities}`],
  newNPCPacks: [`${systemName}.${npcPackName}`],
  useBoost: false,
  useMwStyleAbilities: false,
  mwUseAlternativeItemTypes: false,
};

export const moribundWorldPreset: PresetV1 = {
  schemaVersion: "v1",
  displayName: "Moribund World",
  defaultTheme: "olderThanMemoryTheme",
  investigativeAbilityCategories: [],
  generalAbilityCategories: ["Persuade", "Rebuff", "Attack", "Defense", "Resist", "Magic", "Health", "General"],
  combatAbilities: ["Strength", "Speed", "Finesse", "Cunning", "Ferocity", "Caution"],
  occupationLabel: "Précis",
  shortNotes: ["Series level"],
  longNotes: ["General", "Facial Features", "Hair", "Notable Mannerisms", "Costume"],
  newPCPacks: [],
  newNPCPacks: [],
  useBoost: false,
  useMwStyleAbilities: true,
  mwUseAlternativeItemTypes: true,
  mwHiddenShortNotes: ["Sympathy points"],
};

export const basePresets = {
  pathOfCthulhuPreset,
  niceBlackAgentsPreset,
  nothingToFearPreset,
  pallidStarsPreset,
  castingTheRunesPreset,
  moribundWorldPreset,
};
