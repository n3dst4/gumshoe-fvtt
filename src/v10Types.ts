import * as constants from "./constants";
import { InvestigatorActor } from "./module/InvestigatorActor";
import { InvestigatorItem } from "./module/InvestigatorItem";
import {
  EquipmentSystemData,
  GeneralAbilitySystemData,
  InvestigativeAbilitySystemData,
  MwItemSystemData,
  NPCSystemData,
  PartySystemData,
  PCSystemData,
  PersonalDetailSystemData,
  WeaponSystemData,
} from "./types";

// this is all junk to allow us to start using v10's `.system` property

// /////////////////////////////////////////////////////////////////////////////
// ITEMS

interface InvestigatorItemSystem<Type extends string, SystemData>
  extends InvestigatorItem {
  type: Type;
  system: SystemData;
}

export type GeneralAbilityItem = InvestigatorItemSystem<
  typeof constants.generalAbility,
  GeneralAbilitySystemData
>;

export type InvestigativeAbilityItem = InvestigatorItemSystem<
  typeof constants.investigativeAbility,
  InvestigativeAbilitySystemData
>;

export type WeaponItem = InvestigatorItemSystem<
  typeof constants.weapon,
  WeaponSystemData
>;

export type EquipmentItem = InvestigatorItemSystem<
  typeof constants.equipment,
  EquipmentSystemData
>;

export type MwItem = InvestigatorItemSystem<
  typeof constants.mwItem,
  MwItemSystemData
>;

export type PersonalDetailItem = InvestigatorItemSystem<
  typeof constants.personalDetail,
  PersonalDetailSystemData
>;

export type AbilityItem = GeneralAbilityItem | InvestigativeAbilityItem;

export type AnyItem =
  | AbilityItem
  | WeaponItem
  | EquipmentItem
  | MwItem
  | PersonalDetailItem;

export function isGeneralAbilityItem(
  item: Item | null,
): item is GeneralAbilityItem {
  return item?.type === "generalAbility";
}

export function assertGeneralAbilityItem(
  item: Item | null,
): asserts item is GeneralAbilityItem {
  if (!isGeneralAbilityItem(item)) {
    throw new Error("not a general ability item");
  }
}

export function isInvestigativeAbilityItem(
  item: Item | null,
): item is InvestigativeAbilityItem {
  return item?.type === "investigativeAbility";
}

export function assertInvestigativeAbilityItem(
  item: Item | null,
): asserts item is InvestigativeAbilityItem {
  if (!isInvestigativeAbilityItem(item)) {
    throw new Error("not an investigative ability item");
  }
}

export function isAbilityItem(item: Item | null): item is AbilityItem {
  return isGeneralAbilityItem(item) || isInvestigativeAbilityItem(item);
}

export function assertAbilityItem(
  item: Item | null,
): asserts item is AbilityItem {
  if (!isAbilityItem(item)) {
    throw new Error("not an ability item");
  }
}

export function isEquipmentItem(item: Item | null): item is EquipmentItem {
  return item?.type === "equipment";
}

export function assertEquipmentItem(
  item: Item | null,
): asserts item is EquipmentItem {
  if (!isEquipmentItem(item)) {
    throw new Error("not an equipment item");
  }
}

export function isEquipmentOrAbilityItem(
  item: Item | null,
): item is EquipmentItem | AbilityItem {
  return isAbilityItem(item) || isEquipmentItem(item);
}

export function assertEquipmentOrAbilityItem(
  item: Item | null,
): asserts item is EquipmentItem | AbilityItem {
  if (!isEquipmentOrAbilityItem(item)) {
    throw new Error("not an equipment or ability item");
  }
}

export function isWeaponItem(item: Item | null): item is WeaponItem {
  return item?.type === "weapon";
}

export function assertWeaponItem(
  item: Item | null,
): asserts item is WeaponItem {
  if (!isWeaponItem(item)) {
    throw new Error("not a weapon item");
  }
}

export function isMwItem(item: Item | null): item is MwItem {
  return item?.type === "mwItem";
}

export function assertMwItem(item: Item | null): asserts item is MwItem {
  if (!isMwItem(item)) {
    throw new Error("not an mw item");
  }
}

export function isAnyItem(item: Item | null): item is AnyItem {
  return true;
}

export function assertAnyItem(item: Item | null): asserts item is AnyItem {
  if (!isAnyItem(item)) {
    throw new Error("not an item");
  }
}

export function isPersonalDetailItem(
  item: Item | null,
): item is PersonalDetailItem {
  return item?.type === "personalDetail";
}

export function assertPersonalDetailItem(
  item: Item | null,
): asserts item is PersonalDetailItem {
  if (!isPersonalDetailItem(item)) {
    throw new Error("not a personal detail item");
  }
}

// /////////////////////////////////////////////////////////////////////////////
// ACTORS

interface InvestigatorActorSystem<Type extends string, SystemData>
  extends InvestigatorActor {
  type: Type;
  system: SystemData;
}

export type PCACtor = InvestigatorActorSystem<
  typeof constants.pc,
  PCSystemData
>;

export type NPCActor = InvestigatorActorSystem<
  typeof constants.npc,
  NPCSystemData
>;

export type PartyActor = InvestigatorActorSystem<
  typeof constants.party,
  PartySystemData
>;

export type ActiveCharacterActor = PCACtor | NPCActor;

export type AnyActor = PCACtor | NPCActor | PartyActor;

export type ActorPayload = DeepPartial<AnyActor>;

export function isPCActor(actor: Actor | null): actor is PCACtor {
  return actor?.type === "pc";
}

export function assertPCActor(actor: Actor | null): asserts actor is PCACtor {
  if (!isPCActor(actor)) {
    throw new Error("not a PC actor");
  }
}

export function isNPCActor(actor: Actor | null): actor is NPCActor {
  return actor?.type === "npc";
}

export function assertNPCActor(actor: Actor | null): asserts actor is NPCActor {
  if (!isNPCActor(actor)) {
    throw new Error("not an NPC actor");
  }
}

export function isPartyActor(actor: Actor | null): actor is PartyActor {
  return actor?.type === "party";
}

export function assertPartyActor(
  actor: Actor | null,
): asserts actor is PartyActor {
  if (!isPartyActor(actor)) {
    throw new Error("not a party actor");
  }
}

export function isActiveCharacterActor(
  actor: Actor | null,
): actor is ActiveCharacterActor {
  return isPCActor(actor) || isNPCActor(actor);
}

export function assertActiveCharacterActor(
  actor: Actor | null,
): asserts actor is ActiveCharacterActor {
  if (!isActiveCharacterActor(actor)) {
    throw new Error("not a PC or NPC actor");
  }
}

export function isAnyActor(actor: Actor | null): actor is AnyActor {
  return true;
}

export function assertAnyActor(actor: Actor | null): asserts actor is AnyActor {
  if (!isAnyActor(actor)) {
    throw new Error("not an actor");
  }
}

declare global {
  var isEmpty: typeof isObjectEmpty; // eslint-disable-line no-var
}
