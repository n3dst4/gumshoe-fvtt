import React, { MouseEventHandler, useCallback, useContext } from "react";
import { FaEllipsisH, FaTrash } from "react-icons/fa";
import { confirmADoodleDo, getTranslated } from "../../../functions";
import { AsyncTextInput } from "../../inputs/AsyncTextInput";
import { Dropdown } from "../../inputs/Dropdown";
import { GridField } from "../../inputs/GridField";
import { InputGrid } from "../../inputs/InputGrid";
import { Menu, MenuItem } from "../../inputs/Menu";
import { Translate } from "../../Translate";
import { DispatchContext, StateContext } from "../contexts";
import { addField, deleteCategory, renameCategory } from "../reducer";
import { Field } from "./Field";

interface EquipmentCategoryProps {
  idx: number;
}

export const EquipmentCategory: React.FC<EquipmentCategoryProps> = ({
  idx,
}) => {
  const dispatch = useContext(DispatchContext);
  const settings = useContext(StateContext);

  const handleNameChange = useCallback((newName: string) => {
    dispatch(renameCategory.create({ idx, newName }));
  }, [dispatch, idx]);

  const handleAdd: MouseEventHandler = useCallback((e) => {
    e.preventDefault();
    dispatch(addField.create({ categoryIdx: idx }));
  }, [dispatch, idx]);

  const handleDelete = useCallback(async () => {
    const aye = await confirmADoodleDo({
      message: "Delete Category",
      confirmText: "Delete",
      cancelText: "Whoops, No!",
      confirmIconClass: "fas fa-trash",
      resolveFalseOnCancel: true,
    });
    if (aye) {
      dispatch(deleteCategory.create({ idx }));
    }
  }, [dispatch, idx]);

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
            value={settings.equipmentCategories[idx].name}
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
          {settings.equipmentCategories[idx].fields?.map(
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
