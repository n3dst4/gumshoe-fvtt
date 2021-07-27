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
    { name: "Anthropology" },
    { name: "Archaeology" },
    { name: "Botany" },
    { name: "Culture" },
    { name: "Forensic Accounting" },
    { name: "Forensic Psychology" },
    { name: "Geology" },
    { name: "History" },
    { name: "Law" },
    { name: "Linguistics" },
  ],
  Interpersonal: [
    { name: "Bullshit Detector" },
    { name: "Bureaucracy" },
    { name: "Cop Talk" },
    { name: "Flattery" },
    { name: "Flirting" },
    { name: "Impersonate" },
    { name: "Inspiration" },
    { name: "Interrogation" },
    { name: "Intimidation" },
    { name: "Negotiation" },
    { name: "Reassurance" },
    { name: "Respect" },
  ],
  Technical: [
    { name: "Astronomy" },
    { name: "Chemistry" },
    { name: "Data Retrieval" },
    { name: "Cryptography" },
    { name: "Evidence Collection" },
    { name: "Explosive Devices" },
    { name: "Forensic Anthropology" },
  ],
  Special: [
  ],
};

export const generalAbilities: GeneralAbilitiesData = {
  General: [
    { name: "Athletics" },
    { name: "Business Affairs" },
    { name: "Filch" },
    { name: "Health", max: 15, min: -12, rating: 1, pool: 1, showTracker: true },
    { name: "Infiltration" },
    { name: "Medic" },
    { name: "Preparedness" },
    { name: "Public Relations" },
    { name: "Scuffling" },
    { name: "Sense Trouble" },
    { name: "Shooting" },
    { name: "Surveillance" },
  ],
};
