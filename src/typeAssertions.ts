/* eslint-disable @typescript-eslint/no-unused-vars */
import * as constants from "./constants";
import { hasOwnProperty } from "./functions";
import {
  AbilityDataSource,
  ActiveCharacterDataSource,
  EquipmentDataSource,
  EquipmentFieldType,
  GeneralAbilityDataSource,
  InvestigativeAbilityDataSource,
  InvestigatorActorDataSource,
  InvestigatorItemDataSource,
  MwItemDataSource,
  NPCDataSource,
  PartyDataSource,
  PCDataSource,
  PersonalDetailDataSource,
  SocketHookAction,
  WeaponDataSource,
  WeaponOrEquipmentDataSource,
} from "./types";

export function isSocketHookAction<T>(
  x: SocketHookAction<T> | unknown,
): x is SocketHookAction<T> {
  return hasOwnProperty(x, "hook") && hasOwnProperty(x, "payload");
}

export function isEquipmentFieldType(type: string): type is EquipmentFieldType {
  return type === "string" || type === "number" || type === "checkbox";
}

export function assertIsEquipmentFieldType(
  type: string,
): asserts type is EquipmentFieldType {
  if (!isEquipmentFieldType(type)) {
    throw new Error(`Invalid equipment field type: ${type}`);
  }
}

// ACTORS

function isPCDataSource(
  data: InvestigatorActorDataSource | undefined | null,
): data is PCDataSource {
  return data ? data.type === constants.pc : false;
}

function assertPCDataSource(
  data: InvestigatorActorDataSource | undefined | null,
): asserts data is PCDataSource {
  if (!isPCDataSource(data)) {
    throw new Error("Not a PC");
  }
}

function isNPCDataSource(
  data: InvestigatorActorDataSource | undefined | null,
): data is NPCDataSource {
  return data ? data.type === constants.npc : false;
}

function assertNPCDataSource(
  data: InvestigatorActorDataSource | undefined | null,
): asserts data is NPCDataSource {
  if (!isNPCDataSource(data)) {
    throw new Error("Not an NPC");
  }
}

function isActiveCharacterDataSource(
  data: InvestigatorActorDataSource | undefined | null,
): data is ActiveCharacterDataSource {
  return data
    ? data.type === constants.pc || data.type === constants.npc
    : false;
}

function assertActiveCharacterDataSource(
  data: InvestigatorActorDataSource | undefined | null,
): asserts data is ActiveCharacterDataSource {
  if (!isActiveCharacterDataSource(data)) {
    throw new Error("Not a PC or NPC");
  }
}

function isPartyDataSource(
  data: InvestigatorActorDataSource,
): data is PartyDataSource {
  return data.type === constants.party;
}

function assertPartyDataSource(
  data: InvestigatorActorDataSource,
): asserts data is PartyDataSource {
  if (!isPartyDataSource(data)) {
    throw new Error("Not a Party");
  }
}

// ITEMS

function isGeneralAbilityDataSource(
  data: InvestigatorItemDataSource,
): data is GeneralAbilityDataSource {
  return data.type === constants.generalAbility;
}

function isInvestigativeAbilityDataSource(
  data: InvestigatorItemDataSource,
): data is InvestigativeAbilityDataSource {
  return data.type === constants.investigativeAbility;
}

function isAbilityDataSource(data: any): data is AbilityDataSource {
  return (
    isGeneralAbilityDataSource(data) || isInvestigativeAbilityDataSource(data)
  );
}

/** assert that a data is some kind of ability */
function assertAbilityDataSource(
  data: InvestigatorItemDataSource,
): asserts data is AbilityDataSource {
  if (!isAbilityDataSource(data)) {
    throw new Error("Not an ability");
  }
}

/** assert that a data is a general ability */
function assertGeneralAbilityDataSource(
  data: InvestigatorItemDataSource,
): asserts data is GeneralAbilityDataSource {
  if (!isGeneralAbilityDataSource(data)) {
    throw new Error("Not an ability");
  }
}

function isWeaponDataSource(
  data: InvestigatorItemDataSource,
): data is WeaponDataSource {
  return data.type === constants.weapon;
}

function isEquipmentDataSource(
  data: InvestigatorItemDataSource,
): data is EquipmentDataSource {
  return data.type === constants.equipment;
}

function isEquipmentOrAbilityDataSource(
  data: InvestigatorItemDataSource,
): data is EquipmentDataSource | AbilityDataSource {
  return isEquipmentDataSource(data) || isAbilityDataSource(data);
}

function assertEquipmentDataSource(
  data: InvestigatorItemDataSource,
): asserts data is EquipmentDataSource {
  if (!isEquipmentDataSource(data)) {
    throw new Error("Not an equipment");
  }
}

function assertEquipmentOrAbilityDataSource(
  data: InvestigatorItemDataSource,
): asserts data is EquipmentDataSource | AbilityDataSource {
  if (!isEquipmentOrAbilityDataSource(data)) {
    throw new Error("Not an equipment or ability");
  }
}

/** assert that a data is a weapon */
function assertWeaponDataSource(
  data: InvestigatorItemDataSource,
): asserts data is WeaponDataSource {
  const isWeapon = isWeaponDataSource(data);
  if (!isWeapon) {
    throw new Error("Not a weapon");
  }
}

function assertWeaponOrEquipmentDataSource(
  data: InvestigatorItemDataSource,
): asserts data is WeaponOrEquipmentDataSource {
  const isWeaponOrEquipmentDataSource =
    data.type === constants.weapon || data.type === constants.equipment;
  if (!isWeaponOrEquipmentDataSource) {
    throw new Error("Not a weapon or equipment");
  }
}

function isMwItemDataSource(
  data: InvestigatorItemDataSource,
): data is MwItemDataSource {
  return data.type === constants.mwItem;
}

function assertMwItemDataSource(
  data: InvestigatorItemDataSource,
): asserts data is MwItemDataSource {
  const isMwItem = isMwItemDataSource(data);
  if (!isMwItem) {
    throw new Error("Not a MW Item");
  }
}

function isPersonalDetailDataSource(
  data: InvestigatorItemDataSource,
): data is PersonalDetailDataSource {
  return data.type === constants.personalDetail;
}

function assertPersonalDetailDataSource(
  data: InvestigatorItemDataSource,
): asserts data is PersonalDetailDataSource {
  if (!isPersonalDetailDataSource(data)) {
    throw new Error("Not a personal detail");
  }
}
