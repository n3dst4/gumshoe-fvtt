import { TrailActor } from "./module/TrailActor";

type BaseSkillData = {
  "rating": number,
  "pool": number,
  "hasSpeciality": boolean,
  "speciality": string
}

export type InvestigativeSkillData = BaseSkillData & {
  "category": string,
}

export type GeneralSkillData = BaseSkillData & {
  "canBeInvestigative": boolean,
}

export type InvestigativeSkill = Item<InvestigativeSkillData>;

export type GeneralSkill = Item<GeneralSkillData>;

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

export type PCTrailActor = TrailActor<PCTrailActorData>;
