import { generalAbility, investigativeAbility } from "./constants";
import system from "./system.json";

const investigativeTemplate = {
  type: investigativeAbility,
  category: "Academic",
  hasSpeciality: false,
  specialities: [],
  rating: 0,
  pool: 0,
  min: 0,
  max: 8,
};

const generalTemplate = {
  type: generalAbility,
  canBeUsedInvestigatively: false,
  hasSpeciality: false,
  speciality: "",
  rating: 0,
  pool: 0,
  min: 0,
  max: 8,
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
  { name: "Health", max: 15, min: -12 },
  { name: "Hypnosis" },
  { name: "Magic", max: 15, min: -12 },
  { name: "Mechanical Repair", canBeUsedInvestigatively: true },
  { name: "Piloting" },
  { name: "Preparedness" },
  { name: "Psychoanalysis" },
  { name: "Riding" },
  { name: "Sanity", max: 15 },
  { name: "Scuffling" },
  { name: "Sense Trouble" },
  { name: "Shadowing" },
  { name: "Stability", max: 15 },
  { name: "Stealth" },
  { name: "Technical" },
  { name: "Weapons" },
];

const emptyPack = async (pack: any) => {
  const content = await pack.getContent();
  content.forEach(item => {
    item.delete();
  });
};

export const generateTrailAbilitiesData = async () => {
  const investigativePack = game.packs.find(p => p.collection === `${system.name}.investigativeAbilities`);
  const generalPack = game.packs.find(p => p.collection === `${system.name}.generalAbilities`);
  emptyPack(investigativePack);
  emptyPack(generalPack);

  Object.keys(investigativeAbilities).forEach(async (category) => {
    const abilityDatas = investigativeAbilities[category].map((data) => ({
      type: investigativeTemplate.type,
      name: data.name,
      data: {
        ...investigativeTemplate,
        category,
        ...data,
      },
    }));
    for (const ad of abilityDatas) {
      const a = await Item.create(ad, { temporary: true });
      await investigativePack.importEntity(a);
      console.log(`Imported Item ${a.name} into Compendium pack ${investigativePack.collection}`);
    }
  });

  const abilityDatas = generalAbilities.map((data) => ({
    type: generalTemplate.type,
    name: data.name,
    data: {
      ...generalTemplate,
      ...data,
    },
  }));
  for (const ad of abilityDatas) {
    const a = await Item.create(ad, { temporary: true });
    await generalPack.importEntity(a);
    console.log(`Imported Item ${a.name} into Compendium pack ${generalPack.collection}`);
  }

  // // Create temporary Actor entities which impose structure on the imported data
  // const items = Item.createMany(content, { temporary: true });

  // // Save each temporary Actor into the Compendium pack
  // for (const a of actors) {
  //   await pack.importEntity(a);
  //   console.log(`Imported Actor ${a.name} into Compendium pack ${pack.collection}`);
  // }
};
