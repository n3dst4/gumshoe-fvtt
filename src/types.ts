import { TokenData } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/module.mjs";
import { EquipmentFieldMetadata } from "@lumphammer/investigator-fvtt-types";
import * as constants from "./constants";
export type AbilityType =
  | typeof constants.investigativeAbility
  | typeof constants.generalAbility;

export interface SocketHookAction<T> {
  hook: string;
  payload: T;
}

export interface RequestTurnPassArgs {
  combatantId: string;
}

export type MWDifficulty = "easy" | number;

export type Resource = {
  min?: number;
  max: number;
  value: number;
};

// utility
export type DataSource<TType extends string, TData> = {
  type: TType;
  name: string;
  data: TData;
  img: string;
  token: TokenData;
  _id: string;
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

export enum MwInjuryStatus {
  uninjured = "uninjured",
  hurt = "hurt",
  down = "down",
  unconscious = "unconscious",
  dead = "dead",
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
  sheetTheme: string | null;
  /** deprecated */
  hitThreshold: number;
  mwInjuryStatus: MwInjuryStatus;
  resources: {
    health: Resource;
    sanity: Resource;
    stability: Resource;
    magic: Resource;
  };
  stats: Record<string, number>;
  initiativePassingTurns: number;
}

interface NPCDataSourceData {
  notes: NoteWithFormat;
  initiativeAbility: string;
  hideZeroRated: boolean;
  sheetTheme: string | null;
  /** deprecated */
  hitThreshold: number;
  /** deprecated */
  armor: number;
  /** deprecated */
  alertness: number;
  /** deprecated */
  stealth: number;
  /** deprecated */
  stabilityLoss: number;
  mwInjuryStatus: MwInjuryStatus;
  resources: {
    health: Resource;
    sanity: Resource;
    stability: Resource;
    magic: Resource;
  };
  stats: Record<string, number>;
  combatBonus: number;
  damageBonus: number;
  initiativePassingTurns: number;
}

interface PartyDataSourceData {
  // party stuff
  abilityNames: string[];
  actorIds: string[];
}

export type PCDataSource = DataSource<typeof constants.pc, PCDataSourceData>;
export type NPCDataSource = DataSource<typeof constants.npc, NPCDataSourceData>;
export type PartyDataSource = DataSource<
  typeof constants.party,
  PartyDataSourceData
>;

export type InvestigatorActorDataSource =
  | PCDataSource
  | NPCDataSource
  | PartyDataSource;

export type ActiveCharacterDataSource = PCDataSource | NPCDataSource;

declare global {
  interface SourceConfig {
    Actor: InvestigatorActorDataSource;
  }
  interface DataConfig {
    Actor: InvestigatorActorDataSource;
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
 * data.data for equipment
 */
interface EquipmentDataSourceData extends BaseEquipmentDataSourceData {
  category: string;
  fields: Record<string, string | number | boolean>;
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
    min: number;
    max: number;
    value: number;
  };
}

export interface Unlock {
  rating: number;
  description: string;
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
  unlocks: Unlock[];
}

/** data.data for investigative abilities */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface InvestigativeAbilityDataSourceData
  extends BaseAbilityDataSourceData {}

export type MwRefreshGroup = 2 | 4 | 8;

/** data.data for general abilities */
export interface GeneralAbilityDataSourceData
  extends BaseAbilityDataSourceData {
  canBeInvestigative: boolean;
  goesFirstInCombat: boolean;
  // MW-specific fields
  mwTrumps: string;
  mwTrumpedBy: string;
  mwRefreshGroup: MwRefreshGroup;
  combatBonus: number;
  damageBonus: number;
}

export type MwType =
  | "tweak"
  | "spell"
  | "cantrap"
  | "enchantedItem"
  | "meleeWeapon"
  | "missileWeapon"
  | "manse"
  | "sandestin"
  | "retainer";
export type RangeTuple = [number, number, number, number];

/** data.data for Moribund World stuff */
export interface MwItemDataSourceData {
  mwType: MwType;
  notes: NoteWithFormat;
  charges: number;
  ranges: RangeTuple;
}

/** data.data for personal details */
export interface PersonalDetailSourceData {
  notes: NoteWithFormat;
  index: number;
}

/** data for equipment */
export type EquipmentDataSource = DataSource<
  typeof constants.equipment,
  EquipmentDataSourceData
>;

/** data for weapons */
export type WeaponDataSource = DataSource<
  typeof constants.weapon,
  WeaponDataSourceData
>;

/** data for general abilities */
export type GeneralAbilityDataSource = DataSource<
  typeof constants.generalAbility,
  GeneralAbilityDataSourceData
>;

/** data for investigative abilities */
export type InvestigativeAbilityDataSource = DataSource<
  typeof constants.investigativeAbility,
  InvestigativeAbilityDataSourceData
>;

/** data for Moribund World stuff */
export type MwItemDataSource = DataSource<
  typeof constants.mwItem,
  MwItemDataSourceData
>;

/** data for personal details */
export type PersonalDetailDataSource = DataSource<typeof constants.personalDetail, PersonalDetailSourceData>;

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
  | MwItemDataSource
  | PersonalDetailDataSource;

// now we crowbar this into the global type system using declaration merging
declare global {
  interface SourceConfig {
    Item: InvestigatorItemDataSource;
  }
  interface DataConfig {
    Item: InvestigatorItemDataSource;
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
// export type RecursivePartial<T> = {
//   [P in keyof T]?: T[P] extends (infer U)[]
//   ? RecursivePartial<U>[]
//   : T[P] extends Record<string, unknown>
//   ? RecursivePartial<T[P]>
//   : T[P];
// };

// eslint-disable-next-line @typescript-eslint/ban-types
export type RecursivePartial<T> = T extends Function
  ? T
  : {
      [P in keyof T]?: RecursivePartial<T[P]>;
    };

// eslint-disable-next-line @typescript-eslint/ban-types
export type RecursiveRequired<T> = T extends Function
  ? T
  : {
      [P in keyof T]-?: RecursiveRequired<T[P]>;
    };

export type EquipmentFieldType = Pick<EquipmentFieldMetadata, "type">["type"];
