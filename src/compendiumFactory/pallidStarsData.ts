import { GeneralAbilitiesData, InvestigativeAbilitiesData } from "./types";

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
  Special: [],
};

export const generalAbilities: GeneralAbilitiesData = {
  General: [
    { name: "Athletics", refreshesDaily: true },
    { name: "Business Affairs" },
    { name: "Filch" },
    {
      name: "Health",
      max: 15,
      min: -12,
      rating: 1,
      pool: 1,
      showTracker: true,
    },
    { name: "Infiltration" },
    { name: "Medic" },
    { name: "Preparedness" },
    { name: "Public Relations" },
    { name: "Scuffling", refreshesDaily: true },
    { name: "Sense Trouble" },
    { name: "Shooting", refreshesDaily: true, goesFirstInCombat: true },
    { name: "Surveillance" },
  ],
};
