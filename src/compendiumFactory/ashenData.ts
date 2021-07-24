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
    { name: "Cybe Culture" }, // not in SRD
    { name: "Forensic Accounting" },
    { name: "Forensic Psychology" },
    { name: "Geology" },
    { name: "History, Balla" }, // not in SRD
    { name: "History, Combine" }, // not in SRD
    { name: "History, Durugh" }, // not in SRD
    { name: "History, Human" }, // not in SRD
    { name: "History, Kch-Thk" }, // not in SRD
    { name: "History, Tavak" }, // not in SRD
    { name: "Law" },
    { name: "Linguistics" },
    { name: "Vas Mal Culture" }, // not in SRD
    { name: "Xenoculture" }, // not in SRD
    { name: "Zoology" }, // not in SRD
  ],
  Interpersonal: [
    { name: "Bullshit Detector" },
    { name: "Bureaucracy" },
    { name: "Cop Talk" },
    { name: "Downside" }, // not in SRD
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
    { name: "Bio Signatures" }, // not in SRD
    { name: "Chemistry" },
    { name: "Data Retrieval" },
    { name: "Decryption" }, // not in SRD
    { name: "Energy Signatures" }, // not in SRD
    { name: "Evidence Collection" },
    { name: "Explosive Devices" },
    { name: "Forensic Anthropology" },
    { name: "Forensic Engineering" }, // not in SRD
    { name: "Holo Surveillance" }, // not in SRD
    { name: "Imaging" }, // not in SRD
    { name: "Industrial Design" }, // not in SRD
    { name: "Kinetics" }, // not in SRD
    { name: "Virology" }, // not in SRD
  ],
  "Special (Vas Mal)": [
    { name: "Consciousness Simulation" }, // not in SRD
    { name: "Dreamsight" }, // not in SRD
    { name: "Neurosight" }, // not in SRD
    { name: "Timesight" }, // not in SRD
  ],
};

export const generalAbilities: GeneralAbilitiesData = {
  General: [
    { name: "Athletics" },
    { name: "Battle Console" }, // not in SRD
    { name: "Business Affairs" },
    { name: "Communications Intercept" }, // not in SRD
    { name: "Emotion Suppression (Balla)" }, // not in SRD
    { name: "Enhancement Integration (Cybe)" }, // not in SRD
    { name: "Farsight (Vas Mal)" }, // not in SRD
    { name: "Filch" },
    { name: "Ground Craft" }, // not in SRD
    { name: "Health", max: 15, min: -12, rating: 1, pool: 1, showTracker: true },
    { name: "Helm Control" }, // not in SRD
    { name: "Infiltration" },
    { name: "Medic" },
    { name: "Migrate Consciousness (Kch-Thk)" }, // not in SRD
    { name: "Naval Tactics" }, // not in SRD
    { name: "Neural Rewiring (Cybe)" }, // not in SRD
    { name: "Resist Battle Frenzy (Tavak)" }, // not in SRD
    { name: "Pathway Amplification (Vas Mal)" }, // not in SRD
    { name: "Probability Override (Vas Mal)" }, // not in SRD
    { name: "Phase (Durugh)" }, // not in SRD
    { name: "Preparedness" },
    { name: "Psychic Vitality (Vas Mal)" }, // not in SRD
    { name: "Public Relations" },
    { name: "Scuffling" },
    { name: "Sense Trouble" },
    { name: "Shooting" },
    { name: "Shuttle Craft" }, // not in SRD
    { name: "Surveillance" },
    { name: "Systems Design" }, // not in SRD
    { name: "Systems Repair" }, // not in SRD
    { name: "Viro Manipulation" }, // not in SRD
  ],
};

// { name: "Health", max: 15, min: -12, rating: 4, pool: 4, showTracker: true },
