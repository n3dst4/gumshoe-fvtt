import { EquipmentFieldMetadata } from "@lumphammer/investigator-fvtt-types";
import React, { useCallback } from "react";
import { AsyncNumberInput } from "../inputs/AsyncNumberInput";
import { AsyncTextInput } from "../inputs/AsyncTextInput";
import { Checkbox } from "../inputs/Checkbox";
import { GridField } from "../inputs/GridField";

interface EquipmentFieldProps {
  fieldId: string;
  fieldMetadata: EquipmentFieldMetadata;
  value: string|number|boolean;
}

export const EquipmentField: React.FC<EquipmentFieldProps> = ({
  fieldId,
  fieldMetadata,
  value,
}) => {
  const onChange = useCallback((newValue: string|number|boolean) => {
  }, []);

  return (
    <GridField noTranslate key={fieldId} label={fieldMetadata.name}>
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
