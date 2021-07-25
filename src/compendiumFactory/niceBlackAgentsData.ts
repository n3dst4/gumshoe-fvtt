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
    { name: "Accounting" },
    { name: "Archaeology" },
    { name: "Architecture" },
    { name: "Art History" },
    { name: "Criminology" }, // not in SRD
    { name: "Diagnosis" }, // not in SRD
    { name: "History" },
    { name: "Human Terrain" }, // not in SRD
    { name: "Languages", hasSpecialities: true },
    { name: "Law" },
    { name: "Military Science" },
    { name: "Occult Studies" },
    { name: "Research" },
    { name: "Vampirology" }, // not in SRD
  ],
  Interpersonal: [
    { name: "Bullshit Detector" },
    { name: "Bureaucracy" },
    { name: "Cop Talk" },
    { name: "Flattery" },
    { name: "Flirting" },
    { name: "High Society" },
    { name: "Interrogation" },
    { name: "Intimidation" },
    { name: "Negotiation" },
    { name: "Reassurance" },
    { name: "Streetwise" },
    { name: "Tradecraft" },
  ],
  Technical: [
    { name: "Astronomy" },
    { name: "Chemistry" },
    { name: "Cryptography" },
    { name: "Data Recovery" }, // not in SRD (Data Retrieval)
    { name: "Electronic Surveillance" },
    { name: "Forensic Pathology" }, // not in SRD (Pathology)
    { name: "Forgery", hasSpecialities: true },
    { name: "Notice" },
    { name: "Outdoor Survival" },
    { name: "Pharmacy" }, // not in SRD
    { name: "Photography" },
    { name: "Traffic Analysis" },
    { name: "Urban Survival", hasSpecialities: true }, // not in SRD
  ],
};

export const generalAbilities: GeneralAbilitiesData = {
  General: [
    { name: "Athletics" },
    { name: "Conceal" },
    { name: "Cover" }, // not in SRD (could go "Cover Identities")
    { name: "Digital Intrusion" }, // not in SRD
    { name: "Disguise" },
    { name: "Driving", hasSpecialities: true },
    { name: "Explosive Devices" }, // not in SRD (Explosives)
    { name: "Filch" },
    { name: "Gambling" },
    { name: "Hand-to-Hand" },
    { name: "Health", max: 15, min: -12, rating: 4, pool: 4, showTracker: true },
    { name: "Infiltration" },
    { name: "Mechanics" },
    { name: "Medic" },
    { name: "Network" },
    { name: "Piloting", hasSpecialities: true },
    { name: "Preparedness" },
    { name: "Sense Trouble" },
    { name: "Shooting" },
    { name: "Shrink" },
    { name: "Stability", max: 15, min: -12, rating: 4, pool: 4, showTracker: true },
    { name: "Surveillance" },
    { name: "Weapons" }, // not in SRD (Could go "Melee Weapons" or "Weaponry")
  ],
};
