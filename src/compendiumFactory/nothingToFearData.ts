import { GeneralAbilitiesData, InvestigativeAbilitiesData } from "./types";

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
    { name: "Athletics", refreshesDaily: true },
    { name: "Driving", refreshesDaily: true },
    { name: "Filch" },
    { name: "Fleeing" },
    { name: "Health", min: -12, rating: 1, pool: 1, showTracker: true },
    { name: "Hiding" }, // not in SRD
    { name: "Infiltration" },
    { name: "Mechanics" },
    { name: "Medic" },
    { name: "Preparedness" },
    { name: "Scuffling", refreshesDaily: true },
    { name: "Sense Trouble" },
    { name: "Shooting", refreshesDaily: true },
    { name: "Shrink" },
    { name: "Stability", min: -12, rating: 1, pool: 1, showTracker: true },
  ],
};
