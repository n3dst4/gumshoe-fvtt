import { EquipmentFieldMetadata } from "@lumphammer/investigator-fvtt-types";

import * as constants from "./constants";

// SOCKET STUFF ----------------------------------------------------------------

/**
 * data send out over the game websocket to request all clients to call the
 * hook `hook` with the given payload
 */
export interface SocketHookAction<T> {
  hook: string;
  payload: T;
}

/**
 * args passed to the `requestTurnPass` hook. this is sent out over the
 * websocket and broadcast to everyone. the GM's client picks it up and acts on
 * it.
 */
export interface RequestTurnPassArgs {
  combatantId: string;
}

// FOUNDRY STUFF ---------------------------------------------------------------

/** Foundry's idea of a resource */
export type Resource = {
  min?: number;
  max: number;
  value: number;
};

// NOTES -----------------------------------------------------------------------

/**
 * Enum for the types of notes formats we support.
 */
export enum NoteFormat {
  plain = "plain",
  richText = "richText",
  markdown = "markdown",
}

/**
 * Sometimes notes don't have a format specified, when the format is handeled
 * externally. E.g. for PCs, the format is specified in the actor data so you
 * get the same format across all notes fields. This type represents the bare
 * minimum of a note, the source and the rendered output.
 */
export interface BaseNote {
  source: string;
  html: string;
}

/**
 * For notes where they need their own format.
 */
export interface NoteWithFormat extends BaseNote {
  format: NoteFormat;
}

// MORIBUND WORLD --------------------------------------------------------------

/** MW Injury status */
export enum MwInjuryStatus {
  uninjured = "uninjured",
  hurt = "hurt",
  down = "down",
  unconscious = "unconscious",
  dead = "dead",
}

/** difficulty levels for MW */
export type MWDifficulty = "easy" | number;

// #############################################################################
// #############################################################################
// Actor data stuff
// #############################################################################
// #############################################################################

export interface PCSystemData {
  // this is not used anywhere, but it's in template.json and has been since
  // forever
  buildPoints: number;
  /** @deprecated occupation is now a personalDetail item */
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

export interface NPCSystemData {
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

export interface PartySystemData {
  // party stuff
  abilityNames: string[];
  actorIds: string[];
}

// #############################################################################
// #############################################################################
// Item stuff
// #############################################################################
// #############################################################################

export type AbilityType =
  | typeof constants.investigativeAbility
  | typeof constants.generalAbility;

/** Stuff that is in common between Equipment and Weapons */
export interface BaseEquipmentSystemData {
  notes: NoteWithFormat;
}

/**
 * data.data for equipment
 */
export interface EquipmentSystemData extends BaseEquipmentSystemData {
  category: string;
  fields: Record<string, string | number | boolean>;
}

/** data.data for weapons */
export interface WeaponSystemData extends BaseEquipmentSystemData {
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

export type SpecialitiesMode = "one" | "twoThreeFour";

/** data.data for either type of ability */
interface BaseAbilitySystemData {
  rating: number;
  pool: number;
  min: number;
  max: number;
  occupational: boolean;
  hasSpecialities: boolean;
  specialitiesMode: SpecialitiesMode;
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
export interface InvestigativeAbilitySystemData extends BaseAbilitySystemData {}

export type MwRefreshGroup = 2 | 4 | 8;

/** data.data for general abilities */
export interface GeneralAbilitySystemData extends BaseAbilitySystemData {
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
export interface MwItemSystemData {
  mwType: MwType;
  notes: NoteWithFormat;
  charges: number;
  ranges: RangeTuple;
}

/** data.data for personal details */
export interface PersonalDetailSystemData {
  notes: NoteWithFormat;
  slotIndex: number;
  compendiumPackId: string | null;
}

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

export type Mandatory<T> = Exclude<T, undefined | null>;
