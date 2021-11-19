import * as constants from "./constants";
export type AbilityType = typeof constants.investigativeAbility | typeof constants.generalAbility;

export type MWDifficulty =
  | "easy"
  | number;

export type Resource = {
  min?: number,
  max: number,
  value: number,
}

// utility
export type DataSource<TType extends string, TData> = {
  type: TType,
  name: string,
  data: TData,
  img: string,
};

// NOTES
export enum NoteFormat {
  plain = "plain",
  richText = "richText",
  markdown = "markdown",
}

export interface BaseNote {
  source: string;
  html: string;
}

export interface NoteWithFormat extends BaseNote {
  format: NoteFormat;
}

// #############################################################################
// #############################################################################
// Actor data stuff
// #############################################################################
// #############################################################################

// XXX I think there's a load of things in here we don't need, but let's revisit
// once we're on foundry-vtt-types
interface PCDataSourceData {
  buildPoints: number;
  occupation: string;
  longNotes: BaseNote[];
  longNotesFormat: NoteFormat;
  shortNotes: string[];
  hiddenShortNotes: string[];
  initiativeAbility: string;
  hideZeroRated: boolean;
  sheetTheme: string|null;
  hitThreshold: number;
  resources: {
    health: Resource,
    sanity: Resource,
    stability: Resource,
    magic: Resource,
  };
}

interface NPCDataSourceData {
  notes: NoteWithFormat;
  initiativeAbility: string;
  hideZeroRated: boolean;
  sheetTheme: string|null;
  hitThreshold: number;
  armor: number;
  alertness: number;
  stealth: number;
  stabilityLoss: number;
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

export type PCDataSource = DataSource<typeof constants.pc, PCDataSourceData>;
type NPCDataSource = DataSource<typeof constants.npc, NPCDataSourceData>;
type PartyDataSource = DataSource<typeof constants.party, PartyDataSourceData>;

type InvestigatorActorDataSource =
  | PCDataSource
  | NPCDataSource
  | PartyDataSource

export type ActiveCharacterDataSource =
  | PCDataSource
  | NPCDataSource

declare global {
  interface SourceConfig {
    Actor: InvestigatorActorDataSource;
  }
  interface DataConfig {
    Actor: InvestigatorActorDataSource;
  }
}

export function isPCDataSource (data: InvestigatorActorDataSource | undefined | null): data is PCDataSource {
  return (data ? data.type === constants.pc : false);
}

export function assertPCDataSource (data: InvestigatorActorDataSource | undefined | null): asserts data is PCDataSource {
  if (!isPCDataSource(data)) {
    throw new Error("Not a PC");
  }
}

export function isNPCDataSource (data: InvestigatorActorDataSource | undefined | null): data is NPCDataSource {
  return (data ? data.type === constants.npc : false);
}

export function assertNPCDataSource (data: InvestigatorActorDataSource | undefined | null): asserts data is NPCDataSource {
  if (!isNPCDataSource(data)) {
    throw new Error("Not an NPC");
  }
}

export function isActiveCharacterDataSource (data: InvestigatorActorDataSource | undefined | null): data is ActiveCharacterDataSource {
  return (data ? (data.type === constants.pc || data.type === constants.npc) : false);
}

export function assertActiveCharacterDataSource (data: InvestigatorActorDataSource | undefined | null): asserts data is ActiveCharacterDataSource {
  if (!isActiveCharacterDataSource(data)) {
    throw new Error("Not a PC or NPC");
  }
}

export function isPartyDataSource (data: InvestigatorActorDataSource): data is PartyDataSource {
  return (data.type === constants.party);
}

export function assertPartyDataSource (data: InvestigatorActorDataSource): asserts data is PartyDataSource {
  if (!isPartyDataSource(data)) {
    throw new Error("Not a Party");
  }
}

// #############################################################################
// #############################################################################
// Item stuff
// #############################################################################
// #############################################################################

/** Stuff that is in common between Equipment and Weapons */
interface BaseEquipmentDataSourceData {
  notes: NoteWithFormat;
}

/**
 * data.data for equipment (currently the same as BaseEquipmentDataSourceData)
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface EquipmentDataSourceData extends BaseEquipmentDataSourceData {
}

/** data.data for weapons */
interface WeaponDataSourceData extends BaseEquipmentDataSourceData {
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

/** data.data for either type of ability */
export interface BaseAbilityDataSourceData {
  rating: number;
  pool: number;
  min: number;
  max: number;
  occupational: boolean;
  hasSpecialities: boolean;
  specialities: string[];
  showTracker: boolean;
  boost: boolean;
  category: string;
  excludeFromGeneralRefresh: boolean;
  refreshesDaily: boolean;
  notes: NoteWithFormat;
  // this is defined separately for gen/inv in template.json so they have
  // different defaults but it's the same property
  hideIfZeroRated: boolean;
}

/** data.data for investigative abilities */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface InvestigativeAbilityDataSourceData extends BaseAbilityDataSourceData {
}

export type MwRefreshGroup = 2|4|8;

/** data.data for general abilities */
export interface GeneralAbilityDataSourceData extends BaseAbilityDataSourceData {
  canBeInvestigative: boolean;
  goesFirstInCombat: boolean;
  // MW-specific fields
  mwTrumps: string;
  mwTrumpedBy: string;
  mwRefreshGroup: MwRefreshGroup;
}

export type MwType = "tweak"|"spell"|"cantrap"|"enchantedItem"|"meleeWeapon"|"missileWeapon";
export type RangeTuple = [number, number, number, number];

/** data.data for Moribund World stuff */
export interface MwItemDataSourceData {
  mwType: MwType;
  notes: NoteWithFormat;
  charges: number;
  ranges: RangeTuple;
}

/** data for equipment */
export type EquipmentDataSource = DataSource<typeof constants.equipment, EquipmentDataSourceData>;

/** data for weapons */
export type WeaponDataSource = DataSource<typeof constants.weapon, WeaponDataSourceData>;

/** data for general abilities */
export type GeneralAbilityDataSource = DataSource<typeof constants.generalAbility, GeneralAbilityDataSourceData>;

/** data for investigative abilities */
export type InvestigativeAbilityDataSource = DataSource<typeof constants.investigativeAbility, InvestigativeAbilityDataSourceData>;

/** data for Moribund World stuff */
export type MwItemDataSource = DataSource<typeof constants.mwItem, MwItemDataSourceData>;

/** data for weapon OR equipment (rn this basically means "notes") */
export type WeaponOrEquipmentDataSource =
  | WeaponDataSource
  | EquipmentDataSource;

/** data for either of the ability types */
export type AbilityDataSource =
  | GeneralAbilityDataSource
  | InvestigativeAbilityDataSource;

/** data for any kind of item */
export type InvestigatorItemDataSource =
  | WeaponOrEquipmentDataSource
  | AbilityDataSource
  | MwItemDataSource;

// now we crowbar this into the global type system using declaration merging
declare global {
  interface SourceConfig {
    Item: InvestigatorItemDataSource;
  }
  interface DataConfig {
    Item: InvestigatorItemDataSource;
  }
}

export function isGeneralAbilityDataSource (data: InvestigatorItemDataSource): data is GeneralAbilityDataSource {
  return data.type === constants.generalAbility;
}

export function isInvestigativeAbilityDataSource (data: InvestigatorItemDataSource): data is InvestigativeAbilityDataSource {
  return data.type === constants.investigativeAbility;
}

export function isAbilityDataSource (data: any): data is AbilityDataSource {
  return isGeneralAbilityDataSource(data) || isInvestigativeAbilityDataSource(data);
}

/** assert that a data is some kind of ability */
export function assertAbilityDataSource (data: InvestigatorItemDataSource): asserts data is AbilityDataSource {
  if (!isAbilityDataSource(data)) {
    throw new Error("Not an ability");
  }
}

/** assert that a data is a general ability */
export function assertGeneralAbilityDataSource (data: InvestigatorItemDataSource): asserts data is GeneralAbilityDataSource {
  if (!isGeneralAbilityDataSource(data)) {
    throw new Error("Not an ability");
  }
}

export function isWeaponDataSource (data: InvestigatorItemDataSource): data is WeaponDataSource {
  return data.type === constants.weapon;
}

export function isEquipmentDataSource (data: InvestigatorItemDataSource): data is EquipmentDataSource {
  return data.type === constants.equipment;
}

/** assert that a data is a weapon */
export function assertWeaponDataSource (data: InvestigatorItemDataSource): asserts data is WeaponDataSource {
  const isWeapon = isWeaponDataSource(data);
  if (!isWeapon) {
    throw new Error("Not a weapon");
  }
}

export function assertWeaponOrEquipmentDataSource (data: InvestigatorItemDataSource): asserts data is WeaponOrEquipmentDataSource {
  const isWeaponOrEquipmentDataSource = data.type === constants.weapon || data.type === constants.equipment;
  if (!isWeaponOrEquipmentDataSource) {
    throw new Error("Not a weapon or equipment");
  }
}

export function isMwItemDataSource (data: InvestigatorItemDataSource): data is MwItemDataSource {
  return data.type === constants.mwItem;
}

export function assertMwItemDataSource (data: InvestigatorItemDataSource): asserts data is MwItemDataSource {
  const isMwItem = isMwItemDataSource(data);
  if (!isMwItem) {
    throw new Error("Not a MW Item");
  }
}

// #############################################################################
// #############################################################################
// SETTINGS
// #############################################################################
// #############################################################################

// declare global {
//   namespace ClientSettings {
//     interface Values {
//       [constants["systemName"]]: boolean,
//     }
//   }
// }

// #############################################################################
// #############################################################################
// UTILITY LIBRARY
// #############################################################################
// #############################################################################

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
