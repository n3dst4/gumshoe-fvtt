import React, { useCallback } from "react";
import { FaEllipsisH, FaTrash } from "react-icons/fa";
import { confirmADoodleDo, getTranslated } from "../../../functions";
import { SettingsDict } from "../../../settings";
import { AsyncTextInput } from "../../inputs/AsyncTextInput";
import { Dropdown } from "../../inputs/Dropdown";
import { GridField } from "../../inputs/GridField";
import { InputGrid } from "../../inputs/InputGrid";
import { Menu, MenuItem } from "../../inputs/Menu";
import { Translate } from "../../Translate";
import { Setters } from "../types";
import { Field } from "./Field";

interface CategoryProps {
  setters: Setters;
  tempSettingsRef: React.MutableRefObject<SettingsDict>;
  idx: number;
}
//
export const EquipmentCategory: React.FC<CategoryProps> = ({
  setters,
  tempSettingsRef,
  idx,
}) => {
  const handleNameChange = useCallback((newVal: string) => {
    const newCats = [...tempSettingsRef.current.equipmentCategories];
    newCats[idx] = {
      ...newCats[idx],
      name: newVal,
    };
    setters.equipmentCategories(newCats);
  }, [idx, setters, tempSettingsRef]);

  const handleAdd = useCallback(() => {
    const newCats = [...tempSettingsRef.current.equipmentCategories, { name: "", fields: [] }];
    setters.equipmentCategories(newCats);
  }, [setters, tempSettingsRef]);

  const handleDelete = useCallback(async () => {
    const aye = await confirmADoodleDo({
      message: "Delete Category",
      confirmText: "Delete",
      cancelText: "Whoops, No!",
      confirmIconClass: "fas fa-trash",
      resolveFalseOnCancel: true,
    });
    if (aye) {
      const newCats = [...tempSettingsRef.current.equipmentCategories];
      newCats.splice(idx, 1);
      setters.equipmentCategories(newCats);
    }
  }, [idx, setters, tempSettingsRef]);

  return (
    <>
      <InputGrid>
        <GridField
          label="Name"
          css={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <AsyncTextInput
            css={{ flex: 1 }}
            value={"tempSettings.equipmentCategories[idx].name"}
            onChange={handleNameChange}
          />
        <Dropdown
          showArrow={false}
          label={<FaEllipsisH />}
          css={{
            flex: 0,
          }}
        >
          {
            <Menu>
              <MenuItem icon={<FaTrash />} onClick={handleDelete}>
                {getTranslated("Delete")}
              </MenuItem>
            </Menu>
          }
        </Dropdown>
        </GridField>
        <GridField label="Fields">
          {tempSettingsRef.current.equipmentCategories[idx].fields?.map(
            (field, idx) => {
              return <Field key={idx} field={field} />;
            },
          )}
          <button
            onClick={handleAdd}
          >
            <i className="fas fa-plus" />
            <Translate>Add Field</Translate>
          </button>

        </GridField>
      </InputGrid>
      <hr />
    </>
  );
};

EquipmentCategory.displayName = "EquipmentCategory";
