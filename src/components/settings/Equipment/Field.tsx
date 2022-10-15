import React, { ChangeEventHandler, useCallback, useContext } from "react";
import { EquipmentFieldMetadata } from "@lumphammer/investigator-fvtt-types";
import { AsyncTextInput } from "../../inputs/AsyncTextInput";
import { DispatchContext, StateContext } from "../contexts";
import { slice } from "../reducer";
import { Dropdown } from "../../inputs/Dropdown";
import { FaArrowDown, FaArrowUp, FaEllipsisH, FaTrash } from "react-icons/fa";
import { Menu, MenuItem } from "../../inputs/Menu";
import { getTranslated } from "../../../functions";
import { NumberFieldSettings } from "./NumberFieldSettings";
import { StringFieldSettings } from "./StringFieldSettings";
import { CheckboxFieldSettings } from "./CheckboxFieldSettings";
import { ThemeContext } from "../../../themes/ThemeContext";
import { assertIsEquipmentFieldType } from "../../../typeAssertions";

interface FieldProps {
  field: EquipmentFieldMetadata;
  categoryId: string;
  fieldId: string;
  idx: number;
}

export const Field: React.FC<FieldProps> = ({
  field,
  categoryId,
  fieldId,
  idx,
}) => {
  const theme = useContext(ThemeContext);
  const dispatch = useContext(DispatchContext);
  const { settings: { equipmentCategories } } = useContext(StateContext);
  const fieldsLength = Object.keys(equipmentCategories[categoryId].fields).length;

  const handleNameChange = useCallback((newName: string) => {
    dispatch(slice.creators.renameField({ categoryId, fieldId, newName }));
  }, [dispatch, categoryId, fieldId]);

  const handleTypeChange: ChangeEventHandler<HTMLSelectElement> = useCallback((e) => {
    e.preventDefault();
    const newType = e.currentTarget.value;
    if (newType !== "text" && newType !== "number" && newType !== "checkbox") {
      throw new Error("Invalid field type");
    }
    assertIsEquipmentFieldType(newType);
    dispatch(slice.creators.setFieldType({ categoryId, fieldId, newType }));
  }, [dispatch, categoryId, fieldId]);

  const handleUp = useCallback(() => {
    dispatch(slice.creators.moveFieldUp({ categoryId, fieldId }));
  }, [dispatch, categoryId, fieldId]);

  const handleDown = useCallback(() => {
    dispatch(slice.creators.moveFieldDown({ categoryId, fieldId }));
  }, [dispatch, categoryId, fieldId]);

  const handleDelete = useCallback(async () => {
    const aye = await getTranslated("Delete Field");
    if (aye) {
      dispatch(slice.creators.deleteField({ categoryId, fieldId }));
    }
  }, [dispatch, categoryId, fieldId]);

  return (
    <div
      css={{
        padding: "0.5em",
        borderWidth: "1px",
        margin: "0.5em 0 0.5em 0",
        borderStyle: "solid",
        borderColor: theme.colors.controlBorder,
        backgroundColor: theme.colors.backgroundPrimary,
        // display: "grid"
      }}
    >
      <div
        css={{
          display: "flex",
          gap: "1em",
          marginBottom: "0.5em",
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
            paddingRight: "1em",
            paddingLeft: "1em",
          }}
        >
          {
            <Menu>
              {idx > 0 && (
                <MenuItem icon={<FaArrowUp />} onClick={handleUp}>
                  {getTranslated("Move up")}
                </MenuItem>
              )}
              {idx < fieldsLength - 1 && (
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
      {field.type === "number" && (
        <NumberFieldSettings field={field} categoryId={categoryId} fieldId={fieldId} />
      )}
      {field.type === "string" && (
        <StringFieldSettings field={field} categoryId={categoryId} fieldId={fieldId} />
      )}
      {field.type === "checkbox" && (
        <CheckboxFieldSettings field={field} categoryId={categoryId} fieldId={fieldId} />
      )}
    </div>
  );
};

Field.displayName = "Field";
