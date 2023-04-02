import { InvestigatorActor } from "./module/InvestigatorActor";
import { InvestigatorItem } from "./module/InvestigatorItem";
import {
  EquipmentDataSourceData,
  GeneralAbilityDataSourceData,
  InvestigativeAbilityDataSourceData,
  MwItemDataSourceData,
  NPCDataSourceData,
  PartyDataSourceData,
  PCDataSourceData,
  PersonalDetailSourceData,
  WeaponDataSourceData,
} from "./types";

// this is all junk to allow us to start using v10's `.system` property

// /////////////////////////////////////////////////////////////////////////////
// ITEMS

interface InvestigatorItemSystem<SystemData> extends InvestigatorItem {
  system: SystemData;
}

export type GeneralAbilityItem =
  InvestigatorItemSystem<GeneralAbilityDataSourceData>;

export type InvestigativeAbilityItem =
  InvestigatorItemSystem<InvestigativeAbilityDataSourceData>;

export type WeaponItem = InvestigatorItemSystem<WeaponDataSourceData>;

export type EquipmentItem = InvestigatorItemSystem<EquipmentDataSourceData>;

export type MwItem = InvestigatorItemSystem<MwItemDataSourceData>;

export type PersonalDetailItem =
  InvestigatorItemSystem<PersonalDetailSourceData>;

export type AbilityItem = GeneralAbilityItem | InvestigativeAbilityItem;

export type AnyItem =
  | AbilityItem
  | WeaponItem
  | EquipmentItem
  | MwItem
  | PersonalDetailItem;

export function isGeneralAbilityItem(item: Item): item is GeneralAbilityItem {
  return item.type === "generalAbility";
}

export function assertGeneralAbilityItem(
  item: Item,
): asserts item is GeneralAbilityItem {
  if (!isGeneralAbilityItem(item)) {
    throw new Error("not a general ability item");
  }
}

export function isInvestigativeAbilityItem(
  item: Item,
): item is InvestigativeAbilityItem {
  return item.type === "investigativeAbility";
}

export function assertInvestigativeAbilityItem(
  item: Item,
): asserts item is InvestigativeAbilityItem {
  if (!isInvestigativeAbilityItem(item)) {
    throw new Error("not an investigative ability item");
  }
}

export function isAbilityItem(item: Item): item is AbilityItem {
  return isGeneralAbilityItem(item) || isInvestigativeAbilityItem(item);
}

export function assertAbilityItem(item: Item): asserts item is AbilityItem {
  if (!isAbilityItem(item)) {
    throw new Error("not an ability item");
  }
}

export function isEquipmentItem(item: Item): item is EquipmentItem {
  return item.type === "equipment";
}

export function assertEquipmentItem(item: Item): asserts item is EquipmentItem {
  if (!isEquipmentItem(item)) {
    throw new Error("not an equipment item");
  }
}

export function isEquipmentOrAbilityItem(
  item: Item,
): item is EquipmentItem | AbilityItem {
  return isAbilityItem(item) || isEquipmentItem(item);
}

export function assertEquipmentOrAbilityItem(
  item: Item,
): asserts item is EquipmentItem | AbilityItem {
  if (!isEquipmentOrAbilityItem(item)) {
    throw new Error("not an equipment or ability item");
  }
}

export function isWeaponItem(item: Item): item is WeaponItem {
  return item.type === "weapon";
}

export function assertWeaponItem(item: Item): asserts item is WeaponItem {
  if (!isWeaponItem(item)) {
    throw new Error("not a weapon item");
  }
}

export function isMwItem(item: Item): item is MwItem {
  return item.type === "mwItem";
}

export function assertMwItem(item: Item): asserts item is MwItem {
  if (!isMwItem(item)) {
    throw new Error("not an mw item");
  }
}

export function isAnyItem(item: Item): item is AnyItem {
  return true;
}

export function assertAnyItem(item: Item): asserts item is AnyItem {
  if (!isAnyItem(item)) {
    throw new Error("not an item");
  }
}

export function isPersonalDetailItem(item: Item): item is PersonalDetailItem {
  return item.type === "personalDetail";
}

export function assertPersonalDetailItem(
  item: Item,
): asserts item is PersonalDetailItem {
  if (!isPersonalDetailItem(item)) {
    throw new Error("not a personal detail item");
  }
}

// /////////////////////////////////////////////////////////////////////////////
// ACTORS

interface InvestigatorActorSystem<SystemData> extends InvestigatorActor {
  system: SystemData;
}

export type PCACtor = InvestigatorActorSystem<PCDataSourceData>;

export type NPCActor = InvestigatorActorSystem<NPCDataSourceData>;

export type PartyActor = InvestigatorActorSystem<PartyDataSourceData>;

export type ActiveCharacterActor = PCACtor | NPCActor;

export function isPCActor(actor: Actor): actor is PCACtor {
  return actor.type === "pc";
}

export function assertPCActor(actor: Actor): asserts actor is PCACtor {
  if (!isPCActor(actor)) {
    throw new Error("not a PC actor");
  }
}

export function isNPCActor(actor: Actor): actor is NPCActor {
  return actor.type === "npc";
}

export function assertNPCActor(actor: Actor): asserts actor is NPCActor {
  if (!isNPCActor(actor)) {
    throw new Error("not an NPC actor");
  }
}

export function isPartyActor(actor: Actor): actor is PartyActor {
  return actor.type === "party";
}

export function assertPartyActor(actor: Actor): asserts actor is PartyActor {
  if (!isPartyActor(actor)) {
    throw new Error("not a party actor");
  }
}

export function isActiveCharacterActor(
  actor: Actor,
): actor is ActiveCharacterActor {
  return isPCActor(actor) || isNPCActor(actor);
}

export function assertActiveCharacterActor(
  actor: Actor,
): asserts actor is ActiveCharacterActor {
  if (!isActiveCharacterActor(actor)) {
    throw new Error("not a PC or NPC actor");
  }
}
