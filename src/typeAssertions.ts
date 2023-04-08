import { hasOwnProperty } from "./functions";
import { EquipmentFieldType, SocketHookAction } from "./types";

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
