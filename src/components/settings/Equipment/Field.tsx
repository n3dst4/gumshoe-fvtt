import React, { ChangeEventHandler, useCallback, useContext } from "react";
import { EquipmentFieldMetadata } from "@lumphammer/investigator-fvtt-types";
import { AsyncTextInput } from "../../inputs/AsyncTextInput";
import { DispatchContext } from "../contexts";
import { slice } from "../reducer";
import { assertIsEquipmentFieldType } from "../../../types";

interface FieldProps {
  field: EquipmentFieldMetadata;
  categoryIdx: number;
  fieldIdx: number;
}

export const Field: React.FC<FieldProps> = ({
  field,
  categoryIdx,
  fieldIdx,
}) => {
  const dispatch = useContext(DispatchContext);

  const handleNameChange = useCallback((newName: string) => {
    dispatch(slice.creators.renameField({ categoryIdx, fieldIdx, newName }));
  }, [dispatch, categoryIdx, fieldIdx]);

  const handleTypeChange: ChangeEventHandler<HTMLSelectElement> = useCallback((e) => {
    e.preventDefault();
    const newType = e.currentTarget.value;
    if (newType !== "text" && newType !== "number" && newType !== "checkbox") {
      throw new Error("Invalid field type");
    }
    assertIsEquipmentFieldType(newType);
    dispatch(slice.creators.setFieldType({ categoryIdx, fieldIdx, newType }));
  }, [dispatch, categoryIdx, fieldIdx]);

  return (
    <div
      css={{
        // display: "grid"
      }}
    >
      <div
        css={{
          display: "flex",
        }}
      >
        <AsyncTextInput
          placeholder="Enter field name"
          value={field.name}
          css={{
            flex: 1,
          }}
          onChange={handleNameChange}
        />
        <select
          value={field.type}
          css={{
            flex: 1,
          }}
          onChange={handleTypeChange}
        >
          <option value="text">Text</option>
          <option value="number">Number</option>
          <option value="checkbox">Checkbox</option>
        </select>
      </div>
      <div
        css={{
          // display: "grid",
        }}
      >
        Field: {field.name}
      </div>
    </div>
  );
};

Field.displayName = "Field";
