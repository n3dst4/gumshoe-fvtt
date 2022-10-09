import React, { ChangeEventHandler, useCallback, useContext } from "react";
import { EquipmentFieldMetadata } from "@lumphammer/investigator-fvtt-types";
import { AsyncTextInput } from "../../inputs/AsyncTextInput";
import { DispatchContext, StateContext } from "../contexts";
import { slice } from "../reducer";
import { assertIsEquipmentFieldType } from "../../../types";
import { Dropdown } from "../../inputs/Dropdown";
import { FaArrowDown, FaArrowUp, FaEllipsisH, FaTrash } from "react-icons/fa";
import { Menu, MenuItem } from "../../inputs/Menu";
import { getTranslated } from "../../../functions";

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
  const { settings: { equipmentCategories } } = useContext(StateContext);
  const fieldsLength = equipmentCategories[categoryIdx].fields?.length ?? 0;

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

  const handleUp = useCallback(() => {
    dispatch(slice.creators.moveFieldUp({ categoryIdx, fieldIdx }));
  }, [dispatch, categoryIdx, fieldIdx]);

  const handleDown = useCallback(() => {
    dispatch(slice.creators.moveFieldDown({ categoryIdx, fieldIdx }));
  }, [dispatch, categoryIdx, fieldIdx]);

  const handleDelete = useCallback(async () => {
    const aye = await getTranslated("Delete Field");
    if (aye) {
      dispatch(slice.creators.deleteField({ categoryIdx, fieldIdx }));
    }
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
        <Dropdown
          showArrow={false}
          label={<FaEllipsisH />}
          css={{
            flex: 0,
          }}
        >
          {
            <Menu>
              {fieldIdx > 0 && (
                <MenuItem icon={<FaArrowUp />} onClick={handleUp}>
                  {getTranslated("Move up")}
                </MenuItem>
              )}
              {fieldIdx < fieldsLength - 1 && (
                <MenuItem icon={<FaArrowDown />} onClick={handleDown}>
                  {getTranslated("Move down")}
                </MenuItem>
              )}
              <MenuItem icon={<FaTrash />} onClick={handleDelete}>
                {getTranslated("Delete")}
              </MenuItem>
            </Menu>
          }
        </Dropdown>
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
