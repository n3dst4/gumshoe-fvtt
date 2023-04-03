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
export interface PCDataSourceData {
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

export interface NPCDataSourceData {
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

export interface PartyDataSourceData {
  // party stuff
  abilityNames: string[];
  actorIds: string[];
}

// #############################################################################
// #############################################################################
// Item stuff
// #############################################################################
// #############################################################################

/** Stuff that is in common between Equipment and Weapons */
export interface BaseEquipmentDataSourceData {
  notes: NoteWithFormat;
}

/**
 * data.data for equipment
 */
export interface EquipmentDataSourceData extends BaseEquipmentDataSourceData {
  category: string;
  fields: Record<string, string | number | boolean>;
}

/** data.data for weapons */
export interface WeaponDataSourceData extends BaseEquipmentDataSourceData {
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
  cost: number;
  ammo: {
    min: number;
    max: number;
    value: number;
  };
}

export interface Unlock {
  id: string;
  rating: number;
  description: string;
}

export interface SituationalModifier {
  id: string;
  situation: string;
  modifier: number;
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
  situationalModifiers: SituationalModifier[];
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
  slotIndex: number;
  compendiumPackId: string | null;
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
