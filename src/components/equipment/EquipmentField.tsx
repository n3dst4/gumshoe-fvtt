import { EquipmentFieldMetadata } from "@lumphammer/investigator-fvtt-types";
import React, { useCallback } from "react";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { AsyncNumberInput } from "../inputs/AsyncNumberInput";
import { AsyncTextInput } from "../inputs/AsyncTextInput";
import { Checkbox } from "../inputs/Checkbox";
import { GridField } from "../inputs/GridField";

interface EquipmentFieldProps {
  fieldId: string;
  fieldMetadata: EquipmentFieldMetadata;
  value: string|number|boolean;
  equipment: InvestigatorItem;
}

export const EquipmentField: React.FC<EquipmentFieldProps> = ({
  fieldId,
  fieldMetadata,
  value,
  equipment,
}) => {
  const onChange = useCallback((newValue: string|number|boolean) => {
    equipment.setField(fieldId, newValue);
  }, [equipment, fieldId]);

  return (
    <GridField
      noTranslate
      key={fieldId}
      label={fieldMetadata.name}
      labelTitle={`Field ID: ${fieldId}\nClick to copy to clipboard.`}
      onClickLabel={async () => {
        await navigator.clipboard.writeText(fieldId);
        ui.notifications?.info(`Copied field ID "${fieldId}" to clipboard`);
      }}

    >
      {fieldMetadata.type === "string" && (
        <AsyncTextInput value={value as string} onChange={onChange} />
      )}
      {fieldMetadata.type === "number" && (
        <AsyncNumberInput value={value as number} onChange={onChange} />
      )}
      {fieldMetadata.type === "checkbox" && (
        <Checkbox checked={value as boolean} onChange={onChange} />
      )}
    </GridField>
  );
};

EquipmentField.displayName = "EquipmentField";
