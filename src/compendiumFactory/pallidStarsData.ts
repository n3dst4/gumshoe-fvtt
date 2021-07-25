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
    { name: "C___ Culture" }, // should be Cybe Culture
    { name: "Forensic Accounting" },
    { name: "Forensic Psychology" },
    { name: "Geology" },
    { name: "History, B____" }, // should be History, Balla
    { name: "History, C______" }, // should be History, Combine
    { name: "History, D_____" }, // should be History, Durugh
    { name: "History, H____" }, // should be History, Human
    { name: "History, K__-T__" }, // should be History, Kch-Thk
    { name: "History, T____" }, // should be History, Tavak
    { name: "Law" },
    { name: "Linguistics" },
    { name: "V__ M__ Culture" }, // should be Vas Mal Culture
    { name: "Xenology" }, // should be Xenoculture
    { name: "Zoological Studies" }, // should be Zoology
  ],
  Interpersonal: [
    { name: "Bullshit Detector" },
    { name: "Bureaucracy" },
    { name: "Cop Talk" },
    { name: "Downclass" }, // should be Downside
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
    { name: "Bio Readings" }, // should be Bio Signatures
    { name: "Chemistry" },
    { name: "Data Retrieval" },
    { name: "Cryptography" }, // should be Decryption
    { name: "Energy Readings" }, // should be Energy Signatures
    { name: "Evidence Collection" },
    { name: "Explosive Devices" },
    { name: "Forensic Anthropology" },
    { name: "Forensic Mechanics" }, // should be Forensic Engineering
    { name: "Holographic recording (covert)" }, // should be Holo Surveillance
    { name: "Image Recording" }, // should be Imaging
    { name: "Industrial Studies" }, // should be Industrial Design
    { name: "Kinetic Ballistics" }, // should be Kinetics
    { name: "Virus Studies" }, // should be Virology
  ],
  Special: [ // should be Special (Vas Mal)
    { name: "Conscience Emulation" }, // should be Consciousness Simulation
    { name: "Dream Vision" }, // should be Dreamsight
    { name: "Neuro Vision" }, // should be Neurosight
    { name: "Time Vision" }, // should be Timesight
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
