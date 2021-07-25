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
    { name: "Humanities" }, // not in SRD
    { name: "Languages" },
    { name: "Law" },
    { name: "Occult Studies" },
    { name: "Research" },
    { name: "Social Sciences" }, // not in SRD
    { name: "Trivia" }, // not in SRD
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
    { name: "Computer Use" }, // not in SRD
    { name: "Investigative Procedure" }, // not in SRD
    { name: "Medicine" },
    { name: "Notice" },
    { name: "Outdoor Survival" },
    { name: "Photography" },
    { name: "Science" }, // not in SRD (should have !)
  ],
  "Psychic Powers": [
    { name: "Aura Reading" },
    { name: "Medium" }, // not in SRD
    { name: "Messenger" }, // not in SRD
    { name: "Premonitions" }, // not in SRD
    { name: "Remote Viewing" }, // not in SRD
    { name: "Sensitive" }, // not in SRD
    { name: "Synchronicity" }, // not in SRD
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
