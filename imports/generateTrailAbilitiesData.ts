const investigativeTemplate = {
  type: "investigativeAbility",
  category: "Academic",
  hasSpeciality: false,
  speciality: "",
  rating: 0,
  pool: 0,
};

const generalTemplate = {
  type: "investigativeAbility",
  canBeUsedInvestigatively: false,
  hasSpeciality: false,
  speciality: "",
  rating: 0,
  pool: 0,
};

const investigativeAbilities = {
  Academic: [
    { name: "Accounting" },
    { name: "Anthropology" },
    { name: "Archeology" },
    { name: "Architecture" },
    { name: "Art History" },
    { name: "Biology" },
    { name: "Cthulhu Mythos" },
    { name: "Cryptography" },
    { name: "Geology" },
    { name: "History" },
    { name: "Language", hasSpeciality: true },
    { name: "Law" },
    { name: "Library Use" },
    { name: "Medicine" },
    { name: "Occult" },
    { name: "Physics" },
    { name: "Theology" },
  ],
  Interpersonal: [
    { name: "Assess Honesty" },
    { name: "Bargain" },
    { name: "Bureaucracy" },
    { name: "Cop Talk" },
    { name: "Credit Rating" },
    { name: "Flattery" },
    { name: "Interrogation" },
    { name: "Intimidation" },
    { name: "Oral History" },
    { name: "Reassurance" },
    { name: "Streetwise" },
  ],
  Technical: [
    { name: "Art" },
    { name: "Astronomy" },
    { name: "Chemistry" },
    { name: "Craft" },
    { name: "Evidence Collection" },
    { name: "Forensics" },
    { name: "Locksmith" },
    { name: "Outdoorsman" },
    { name: "Pharmacy" },
    { name: "Photography" },
  ],
};

const generalAbilities = [
  { name: "Athletics" },
  { name: "Conceal" },
  { name: "Disguise", canBeUsedInvestigatively: true },
  { name: "Driving" },
  { name: "Electrical Repair", canBeUsedInvestigatively: true },
  { name: "Explosives", canBeUsedInvestigatively: true },
  { name: "Filch" },
  { name: "Firearms" },
  { name: "First Aid" },
  { name: "Fleeing" },
  { name: "Health" },
  { name: "Hypnosis" },
  { name: "Magic" },
  { name: "Mechanical Repair", canBeUsedInvestigatively: true },
  { name: "Piloting" },
  { name: "Preparedness" },
  { name: "Psychoanalysis" },
  { name: "Riding" },
  { name: "Sanity" },
  { name: "Scuffling" },
  { name: "Sense Trouble" },
  { name: "Shadowing" },
  { name: "Stability" },
  { name: "Stealth" },
  { name: "Technical" },
  { name: "Weapons" },
];

export const generateTrailAbilitiesData = () => {
  console.log(investigativeTemplate, generalTemplate, investigativeAbilities, generalAbilities);

  // Reference a Compendium pack by it's collection ID
  const pack = game.packs.find(p => p.collection === `${moduleName}.${packName}`);

  // Load an external JSON data file which contains data for import
  const response = await fetch("worlds/myworld/data/import.json");
  const content = await response.json();

  // Create temporary Actor entities which impose structure on the imported data
  const actors = Actor.createMany(content, { temporary: true });

  // Save each temporary Actor into the Compendium pack
  for (const a of actors) {
    await pack.importEntity(a);
    console.log(`Imported Actor ${a.name} into Compendium pack ${pack.collection}`);
  }
};
