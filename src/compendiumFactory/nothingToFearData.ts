import { generalAbility, generalAbilityIcon, investigativeAbility, investigativeAbilityIcon } from "../constants";
import { GeneralAbilitiesData, GeneralAbilityTemplate, InvestigativeAbilitiesData, InvestigativeAbilityTemplate } from "./types";

export const investigativeTemplate: InvestigativeAbilityTemplate = {
  type: investigativeAbility,
  img: investigativeAbilityIcon,
  category: "Academic",
  hasSpecialities: false,
  specialities: [],
  rating: 0,
  pool: 0,
  min: 0,
  max: 8,
  occupational: false,
  showTracker: false,
};

export const generalTemplate: GeneralAbilityTemplate = {
  type: generalAbility,
  img: generalAbilityIcon,
  canBeInvestigative: false,
  hasSpecialities: false,
  specialities: [],
  rating: 0,
  pool: 0,
  min: 0,
  max: 8,
  occupational: false,
  category: "General",
  showTracker: false,
};

export const investigativeAbilities: InvestigativeAbilitiesData = {
  Academic: [
    { name: "History" },
    { name: "Languages" },
    { name: "Law" },
    { name: "Occult Studies" },
    { name: "Research" },
    { name: "Trivia" },
  ],
  Interpersonal: [
    { name: "Bullshit Detector" },
    { name: "Bureaucracy" },
    { name: "Cop Talk" },
    { name: "Flattery" },
    { name: "Flirting" },
    { name: "Impersonate" },
    { name: "Interrogation" },
    { name: "Intimidation" },
    { name: "Negotiation" },
    { name: "Reassurance" },
    { name: "Streetwise" },
  ],
  Technical: [
    { name: "Medicine" },
    { name: "Notice" },
    { name: "Outdoor Survival" },
    { name: "Photography" },
    { name: "Science!" },
  ],
  "Psychic Powers": [
    { name: "Aura Reading" },
  ],
};

export const generalAbilities: GeneralAbilitiesData = {
  General: [
    { name: "Athletics" },
    { name: "Driving" },
    { name: "Filch" },
    { name: "Fleeing" },
    { name: "Health", min: -12, rating: 1, pool: 1, showTracker: true },
    { name: "Hiding" }, // not in SRD
    { name: "Infiltration" },
    { name: "Mechanics" },
    { name: "Medic" },
    { name: "Preparedness" },
    { name: "Scuffling" },
    { name: "Sense Trouble" },
    { name: "Shooting" },
    { name: "Shrink" },
    { name: "Stability", min: -12, rating: 1, pool: 1, showTracker: true },
  ],
};
