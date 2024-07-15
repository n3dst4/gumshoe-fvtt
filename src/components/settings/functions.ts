import { EquipmentFieldMetadata } from "@lumphammer/investigator-fvtt-types";

export function assertNumericFieldOkayness(
  field: EquipmentFieldMetadata | undefined,
  id: string,
  value: unknown,
): asserts field is Extract<EquipmentFieldMetadata, { type: "number" }> {
  if (field === undefined) {
    throw new Error(`No field with id ${id}`);
  }
  if (field.type !== "number") {
    throw new Error(`Cannot set min/max on field type ${field.type}`);
  }
  if (typeof value !== "number" && value !== undefined) {
    throw new Error(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `Invalid value ${value} for field ${field.name} (must be a number)`,
    );
  }
}
