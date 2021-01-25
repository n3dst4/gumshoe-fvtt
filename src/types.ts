// import { TrailActor } from "./module/TrailActor";
// type BaseAbilityData = {
//   "rating": number,
//   "pool": number,
//   "hasSpecialities": boolean,
//   "speciality": string
// }

// export type InvestigativeAbilityData = BaseAbilityData & {
//   "category": string,
// }

// export type GeneralAbilityData = BaseAbilityData & {
//   "canBeInvestigative": boolean,
// }

// export type InvestigativeAbility = Item<InvestigativeAbilityData>;

// export type GeneralAbility = Item<GeneralAbilityData>;

export type PCTrailActorData = {
  "buildPoints": number,
  "health": number,
  "stability": number,
  "sanity:": number,
  "magic": number,
  "drive": string,
  "occupation": string,
  "occupationalBenefits": string,
};

// export type PCTrailActor = TrailActor<PCTrailActorData>;
