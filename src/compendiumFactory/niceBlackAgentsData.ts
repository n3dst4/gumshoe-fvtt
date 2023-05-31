import { GeneralAbilitiesData, InvestigativeAbilitiesData } from "./types";

export const investigativeAbilities: InvestigativeAbilitiesData = {
  Academic: [
    { name: "Accounting" },
    { name: "Archaeology" },
    { name: "Architecture" },
    { name: "Art History" },
    { name: "Criminology" },
    {
      name: "Diagnosis",
      unlocks: [
        { description: "Medical license", id: "medicallicence", rating: 2 },
      ],
    },
    { name: "History" },
    { name: "Human Terrain" },
    { name: "Languages", hasSpecialities: true },
    { name: "Law" },
    { name: "Military Science" },
    { name: "Occult Studies" },
    { name: "Research" },
    { name: "Vampirology" },
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
    { name: "Streetwise", rating: 1 },
    { name: "Tradecraft", rating: 1 },
  ],
  Technical: [
    { name: "Astronomy" },
    { name: "Chemistry" },
    { name: "Cryptography" },
    { name: "Data Recovery" },
    { name: "Electronic Surveillance" },
    { name: "Forgery", hasSpecialities: true },
    { name: "Notice" },
    { name: "Outdoor Survival" },
    { name: "Pharmacy" },
    { name: "Photography" },
    { name: "Traffic Analysis" },
    { name: "Urban Survival" },
  ],
};

export const generalAbilities: GeneralAbilitiesData = {
  General: [
    {
      name: "Athletics",
      refreshesDaily: true,
      unlocks: [
        {
          description: "Hard to Hit",
          id: "hardtohit",
          rating: 8,
        },
      ],
    },
    {
      name: "Conceal",
      unlocks: [
        { description: "Perfect Holdout", id: "perfectholdout", rating: 8 },
      ],
    },
    { name: "Cover", rating: 10, excludeFromGeneralRefresh: true },
    {
      name: "Digital Intrusion",
      unlocks: [
        { description: "Cracker's Crypto", id: "crackerscrypto", rating: 8 },
      ],
    },
    {
      name: "Disguise",
      unlocks: [
        { description: "Connected Cover", id: "connectedcover", rating: 8 },
      ],
    },
    {
      name: "Driving",
      hasSpecialities: true,
      refreshesDaily: true,
      unlocks: [
        { description: "Grand Theft Auto", id: "grandtheftauto", rating: 8 },
      ],
    },
    {
      name: "Explosive Devices",
      unlocks: [{ description: "Bigger Bang", id: "biggerbang", rating: 8 }],
    },
    {
      name: "Filch",
      unlocks: [{ description: "No Slipups", id: "noslipups", rating: 8 }],
    },
    {
      name: "Gambling",
      unlocks: [
        { description: "Luck of the Devil", id: "luckofthedevil", rating: 8 },
      ],
    },
    {
      name: "Hand-to-Hand",
      refreshesDaily: true,
      unlocks: [
        { description: "Eye of the Tiger", id: "Eye of the Tiger", rating: 8 },
      ],
    },
    {
      name: "Health",
      max: 15,
      min: -12,
      rating: 4,
      pool: 4,
      showTracker: true,
    },
    {
      name: "Infiltration",
      unlocks: [{ description: "Open Sesame", id: "opensesame", rating: 8 }],
    },
    {
      name: "Mechanics",
      unlocks: [
        { description: "Swiss Army Prep", id: "swissarmyprep", rating: 8 },
      ],
    },
    {
      name: "Medic",
      unlocks: [
        {
          description: "Medical School of Hard Knocks",
          id: "medicalschoolofhardknocks",
          rating: 8,
        },
      ],
    },
    { name: "Network", excludeFromGeneralRefresh: true },
    {
      name: "Piloting",
      hasSpecialities: true,
      refreshesDaily: true,
      unlocks: [
        { description: "Grand Theft Aero", id: "grandtheftaero", rating: 8 },
      ],
    },
    {
      name: "Preparedness",
      unlocks: [
        {
          description: "In the Nick of Time",
          id: "inthenickoftime",
          rating: 8,
        },
      ],
    },
    {
      name: "Sense Trouble",
      unlocks: [
        {
          description: "Combat Intuition",
          id: "combatintuition",
          rating: 8,
        },
      ],
    },
    { name: "Shooting", refreshesDaily: true, goesFirstInCombat: true },
    {
      name: "Shrink",
      unlocks: [
        {
          description: "Talk It Out",
          id: "talkitout",
          rating: 8,
        },
      ],
    },
    {
      name: "Stability",
      max: 15,
      min: -12,
      rating: 4,
      pool: 4,
      showTracker: true,
    },
    {
      name: "Surveillance",
      unlocks: [{ description: "The Wire", id: "thewire", rating: 8 }],
    },
    {
      name: "Weapons",
      refreshesDaily: true,
      unlocks: [
        {
          description: "Quincey Morris’ Bowie Knife",
          id: "quinceymorrisbowieknife",
          rating: 8,
        },
      ],
    },
  ],
};
