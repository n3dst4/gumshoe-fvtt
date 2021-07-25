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
    { name: "Anthropology" },
    { name: "Archeology" },
    { name: "Architecture" },
    { name: "Art History" },
    { name: "Biology" }, // not in SRD, are you fucking joking
    { name: "Cthulhu Mythos" }, // not in SRD
    { name: "Cryptography" }, // not in SRD
    { name: "Geology" },
    { name: "History" },
    { name: "Language", hasSpecialities: true },
    { name: "Law" },
    { name: "Library Use" }, // not in SRD FFS
    { name: "Medicine" }, // not in SRD
    { name: "Occult" }, // not in SRD (has "Occult Studies")
    { name: "Physics" }, // not in SRD
    { name: "Theology" }, // not in SRD
  ],
  Interpersonal: [
    { name: "Assess Honesty" }, // not in SRD (has "Bullshit Detector")
    { name: "Bargain" }, // not in SRD
    { name: "Bureaucracy" },
    { name: "Cop Talk" },
    { name: "Credit Rating" }, // not in SRD
    { name: "Flattery" },
    { name: "Interrogation" },
    { name: "Intimidation" },
    { name: "Oral History" },
    { name: "Reassurance" },
    { name: "Streetwise" },
  ],
  Technical: [
    { name: "Art" }, // not in SRD
    { name: "Astronomy" },
    { name: "Chemistry" },
    { name: "Craft" },
    { name: "Evidence Collection" },
    { name: "Forensics" }, // not in SRD
    { name: "Locksmith" },
    { name: "Outdoorsman" }, // not in SRD (has "Outdoor survival")
    { name: "Pharmacy" }, // not in SRD
    { name: "Photography" },
  ],
};

export const generalAbilities: GeneralAbilitiesData = {
  General: [
    { name: "Athletics" },
    { name: "Conceal" },
    { name: "Disguise", canBeInvestigative: true },
    { name: "Driving" },
    { name: "Electrical Repair", canBeInvestigative: true }, // not in SRD
    { name: "Explosives", canBeInvestigative: true },
    { name: "Filch" },
    { name: "Firearms" }, // not in SRD (has Shooting)
    { name: "First Aid" }, // not in SRD (has medic)
    { name: "Fleeing" },
    { name: "Health", max: 15, min: -12, rating: 1, pool: 1, showTracker: true },
    { name: "Hypnosis" },
    { name: "Magic", max: 15, showTracker: true }, // not in SRD
    { name: "Mechanical Repair", canBeInvestigative: true }, // not in SRD
    { name: "Piloting" },
    { name: "Preparedness" },
    { name: "Psychoanalysis" }, // not in SRD (has Shrink)
    { name: "Riding" },
    { name: "Sanity", max: 15, rating: 4, pool: 4, showTracker: true }, // not in SRD
    { name: "Scuffling" },
    { name: "Sense Trouble" },
    { name: "Shadowing" }, // not in SRD
    { name: "Stability", max: 15, min: -12, rating: 1, pool: 1, showTracker: true },
    { name: "Stealth" }, // not in SRD
    { name: "Weapons" }, // not in SRD
  ],
};
