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

export function isGeneralAbilityItem(
  item: InvestigatorItem,
): item is GeneralAbilityItem {
  return item.type === "generalAbility";
}

export function assertGeneralAbilityItem(
  item: InvestigatorItem,
): asserts item is GeneralAbilityItem {
  if (!isGeneralAbilityItem(item)) {
    throw new Error("not a general ability item");
  }
}

export function isInvestigativeAbilityItem(
  item: InvestigatorItem,
): item is InvestigativeAbilityItem {
  return item.type === "investigativeAbility";
}

export function assertInvestigativeAbilityItem(
  item: InvestigatorItem,
): asserts item is InvestigativeAbilityItem {
  if (!isInvestigativeAbilityItem(item)) {
    throw new Error("not an investigative ability item");
  }
}

export function isAbilityItem(item: InvestigatorItem): item is AbilityItem {
  return isGeneralAbilityItem(item) || isInvestigativeAbilityItem(item);
}

export function assertAbilityItem(
  item: InvestigatorItem,
): asserts item is AbilityItem {
  if (!isAbilityItem(item)) {
    throw new Error("not an ability item");
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
