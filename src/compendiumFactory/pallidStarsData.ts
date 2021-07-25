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
    { name: "C Culture" }, // should be Cybe Culture
    { name: "Forensic Accounting" },
    { name: "Forensic Psychology" },
    { name: "Geology" },
    { name: "History, B" }, // should be History, Balla
    { name: "History, C" }, // should be History, Combine
    { name: "History, D" }, // should be History, Durugh
    { name: "History, H" }, // should be History, Human
    { name: "History, K-T" }, // should be History, Kch-Thk
    { name: "History, T" }, // should be History, Tavak
    { name: "Law" },
    { name: "Linguistics" },
    { name: "VM Culture" }, // should be Vas Mal Culture
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
    { name: "Battle Control" }, // should be Battle Console
    { name: "Business Affairs" },
    { name: "Comms Intercept" }, // should be Communications Intercept
    { name: "Emotion Control" }, // should be Emotion Suppression (Balla)
    { name: "Enhancement Maintenance" }, // should be Enhancement Integration (Cybe)
    { name: "Faraway sight" }, // should be Farsight (Vas Mal)
    { name: "Filch" },
    { name: "Ground Vehicle" }, // should be Ground Craft
    { name: "Health", max: 15, min: -12, rating: 1, pool: 1, showTracker: true },
    { name: "Helm Pilot" }, // should be Helm Control
    { name: "Infiltration" },
    { name: "Medic" },
    { name: "Migrate Conscience" }, // should be Migrate Consciousness (Kch-Thk)
    { name: "Naval Maneuvers" }, // should be Naval Tactics
    { name: "Neural Restructuring" }, // should be Neural Rewiring (Cybe)
    // placemarker
    { name: "Resist Battle Frenzy (Tavak)" }, // should be Resist Battle Frenzy (Tavak)
    { name: "Pathway Amplification (Vas Mal)" }, // should be Pathway Amplification (Vas Mal)
    { name: "Probability Override (Vas Mal)" }, // should be Probability Override (Vas Mal)
    { name: "Phase (Durugh)" }, // should be Phase (Durugh)
    { name: "Preparedness" },
    { name: "Psychic Vitality (Vas Mal)" }, // should be Psychic Vitality (Vas Mal)
    { name: "Public Relations" },
    { name: "Scuffling" },
    { name: "Sense Trouble" },
    { name: "Shooting" },
    { name: "Shuttle Craft" }, // should be Shuttle Craft
    { name: "Surveillance" },
    { name: "Systems Design" }, // should be Systems Design
    { name: "Systems Repair" }, // should be Systems Repair
    { name: "Viro Manipulation" }, // should be Viro Manipulation
  ],
};

// { name: "Health", max: 15, min: -12, rating: 4, pool: 4, showTracker: true },
