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
  refreshesDaily: false,
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
    { name: "Accounting" },
    { name: "Anthropology" },
    { name: "Archeology" },
    { name: "Architecture" },
    { name: "Art History" },
    { name: "Cryptography" },
    { name: "Geology" },
    { name: "History" },
    { name: "Languages", hasSpecialities: true },
    { name: "Law" },
    { name: "Medical Expertise" },
    { name: "Occult Studies" },
  ],
  Interpersonal: [
    { name: "Bullshit Detector" },
    { name: "Bureaucracy" },
    { name: "Cop Talk" },
    { name: "Flattery" },
    { name: "Interrogation" },
    { name: "Intimidation" },
    { name: "Oral History" },
    { name: "Reassurance" },
    { name: "Streetwise" },
  ],
  Technical: [
    { name: "Astronomy" },
    { name: "Chemistry" },
    { name: "Craft" },
    { name: "Evidence Collection" },
    { name: "Locksmith" },
    { name: "Photography" },
  ],
};

export const generalAbilities: GeneralAbilitiesData = {
  General: [
    { name: "Athletics", refreshesDaily: true },
    { name: "Conceal" },
    { name: "Disguise", canBeInvestigative: true },
    { name: "Driving", refreshesDaily: true },
    { name: "Explosives", canBeInvestigative: true },
    { name: "Filch" },
    { name: "First Aid" },
    { name: "Fleeing", refreshesDaily: true },
    { name: "Health", max: 15, min: -12, rating: 1, pool: 1, showTracker: true },
    { name: "Hypnosis" },
    { name: "Piloting" },
    { name: "Preparedness" },
    { name: "Riding", refreshesDaily: true },
    { name: "Scuffling", refreshesDaily: true },
    { name: "Sense Trouble" },
    { name: "Stability", max: 15, min: -12, rating: 1, pool: 1, showTracker: true },
  ],
};
