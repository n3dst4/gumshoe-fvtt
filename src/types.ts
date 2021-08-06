import * as constants from "./constants";
export type AbilityType = typeof constants.investigativeAbility | typeof constants.generalAbility;

export type Resource = {
  min?: number,
  max: number,
  value: number,
}

// utility
type DataSource<TType extends string, TData> = {
  type: TType,
  data: TData,
};

// START Actor data stuff

// XXX I think there's a load of things in here we don't need, but let's revisit
// once we're on foundry-vtt-types
interface PCDataSourceData {
  buildPoints: number;
  health: number;
  stability: number;
  sanity: number;
  magic: number;

  occupation: string;

  longNotes: string[];
  shortNotes: string[];

  initiativeAbility: string;
  hideZeroRated: boolean;
  sheetTheme: string|null;
  resources: {
    health: Resource,
    sanity: Resource,
    stability: Resource,
    magic: Resource,
  };
}

interface PartyDataSourceData {
  // party stuff
  abilityNames: string[];
  actorIds: string[];
}

type InvestigatorActorDataSource =
  | DataSource<typeof constants.pc, PCDataSourceData>
  | DataSource<typeof constants.party, PartyDataSourceData>

declare global {
  interface SourceConfig {
    Actor: InvestigatorActorDataSource;
  }
}

// -----------------------------------------------------------
// Item stuff

interface EquipmentDataSourceData {
  notes: string;
}

interface WeaponDataSourceData {
  notes: string;
  ability: string;
  damage: number;
  pointBlankDamage: number;
  closeRangeDamage: number;
  nearRangeDamage: number;
  longRangeDamage: number;
  isPointBlank: boolean;
  isCloseRange: boolean;
  isNearRange: boolean;
  isLongRange: boolean;
  usesAmmo: boolean;
  ammoPerShot: number;
  ammo: {
    min: number,
    max: number,
    value: number,
  };
}

interface BaseAbilityDataSourceData {
  rating: number;
  pool: number;
  min: number;
  max: number;
  occupational: boolean;
  hasSpecialities: boolean;
  specialities: string[];
  showTracker: boolean;
}

interface InvestigativeAbilityDataSourceData extends BaseAbilityDataSourceData {
  category: string;
}

interface GeneralAbilityDataSourceData extends BaseAbilityDataSourceData {
  canBeInvestigative: boolean;
}

type InvestigatorItemDataSource =
  |DataSource<typeof constants.equipment, EquipmentDataSourceData>
  |DataSource<typeof constants.weapon, WeaponDataSourceData>
  |DataSource<typeof constants.generalAbility, GeneralAbilityDataSourceData>
  |DataSource<typeof constants.investigativeAbility, InvestigativeAbilityDataSourceData>;

declare global {
  interface SourceConfig {
    Item: InvestigatorItemDataSource;
  }
}

// -----------------------------------------------------------------------------
// UTILITY LIBRARY

/**
 * this is wild - extract a subset of prperties from a type based on a test
 * see https://stackoverflow.com/a/57386444/212676
 *
 * this was a dumb experiment but i'm leaving it here because TS is cool.
 */
export type PickByType<T, P> = Omit<
  T,
  { [K in keyof T]: T[K] extends P ? never : K }[keyof T]
>;

/**
 * Like Partial<T>, but recursive.
 */
export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
  ? RecursivePartial<U>[]
  : T[P] extends Record<string, unknown>
  ? RecursivePartial<T[P]>
  : T[P];
};
