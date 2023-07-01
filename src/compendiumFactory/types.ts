import { generalAbility, investigativeAbility } from "../constants";
import {
  GeneralAbilityDataSourceData,
  InvestigativeAbilityDataSourceData,
} from "../types";

interface Essentials {
  name?: string;
  img?: string;
}

export interface InvestigativeAbilityTemplate
  extends Partial<InvestigativeAbilityDataSourceData>,
    Essentials {
  type?: typeof investigativeAbility;
}

export interface GeneralAbilityTemplate
  extends Partial<GeneralAbilityDataSourceData>,
    Essentials {
  type?: typeof generalAbility;
}

export interface AbilityDump<T> {
  [category: string]: T[];
}

export type InvestigativeAbilitiesData =
  AbilityDump<InvestigativeAbilityTemplate>;

export type GeneralAbilitiesData = AbilityDump<GeneralAbilityTemplate>;
