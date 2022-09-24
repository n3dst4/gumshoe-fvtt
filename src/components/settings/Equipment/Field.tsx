import React from "react";
import { EquipmentFieldMetadata } from "@lumphammer/investigator-fvtt-types";

interface FieldProps {
  field: EquipmentFieldMetadata;
}

export const Field: React.FC<FieldProps> = ({
  field,
}) => {
  return (
    <div>{field.name}</div>
  );
};

Field.displayName = "Field";
