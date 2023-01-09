import React, { MouseEventHandler, useCallback, useContext } from "react";
import {
  FaEllipsisH,
  FaTrash,
  FaArrowUp,
  FaArrowDown,
  FaCode,
} from "react-icons/fa";
import { confirmADoodleDo, getTranslated } from "../../../functions";
import { AsyncTextInput } from "../../inputs/AsyncTextInput";
import { Dropdown } from "../../inputs/Dropdown";
import { GridField } from "../../inputs/GridField";
import { InputGrid } from "../../inputs/InputGrid";
import { Menu, MenuItem } from "../../inputs/Menu";
import { Translate } from "../../Translate";
import { DispatchContext, StateContext } from "../contexts";
import { slice } from "../reducer";
import { Field } from "./Field";

interface CategoryProps {
  id: string;
  idx: number;
}

export const Category: React.FC<CategoryProps> = ({ id, idx }) => {
  const dispatch = useContext(DispatchContext);
  const { settings } = useContext(StateContext);

  const handleNameChange = useCallback(
    (newName: string) => {
      dispatch(slice.creators.renameCategory({ id, newName }));
    },
    [dispatch, id],
  );

  const handleAddField: MouseEventHandler = useCallback(
    (e) => {
      e.preventDefault();
      dispatch(slice.creators.addField({ categoryId: id }));
    },
    [dispatch, id],
  );

  const handleUp: MouseEventHandler = useCallback(
    (e) => {
      e.preventDefault();
      dispatch(slice.creators.moveCategoryUp({ id }));
    },
    [dispatch, id],
  );

  const handleDown: MouseEventHandler = useCallback(
    (e) => {
      e.preventDefault();
      dispatch(slice.creators.moveCategoryDown({ id }));
    },
    [dispatch, id],
  );

  const handleDelete = useCallback(async () => {
    const aye = await confirmADoodleDo({
      message: "Delete Category",
      confirmText: "Delete",
      cancelText: "Whoops, No!",
      confirmIconClass: "fas fa-trash",
      resolveFalseOnCancel: true,
    });
    if (aye) {
      dispatch(slice.creators.deleteCategory({ id }));
    }
  }, [dispatch, id]);

  const handleClickEditId = useCallback(() => {
    const newId = prompt(
      `Change ID string for "${settings.equipmentCategories[id].name}"\n\n` +
        "⚠️ Careful! This will remove category information from any equipment using the current ID.",
      id,
    );
    if (newId) {
      dispatch(slice.creators.changeCategoryId({ oldId: id, newId }));
    }
  }, [dispatch, id, settings.equipmentCategories]);

  return (
    <>
      <InputGrid
        css={{
          paddingTop: "0.5em",
        }}
      >
        <GridField
          label="Category Name"
          css={{
            display: "flex",
            gap: "1em",
            flexDirection: "row",
          }}
        >
          <AsyncTextInput
            css={{ flex: 1 }}
            value={settings.equipmentCategories[id].name}
            onChange={handleNameChange}
          />
          <Dropdown
            showArrow={false}
            label={<FaEllipsisH />}
            css={{
              flex: 0,
              paddingLeft: "1em",
              paddingRight: "1em",
            }}
          >
            {
              <Menu>
                {idx > 0 && (
                  <MenuItem icon={<FaArrowUp />} onClick={handleUp}>
                    {getTranslated("Move up")}
                  </MenuItem>
                )}
                {idx < Object.keys(settings.equipmentCategories).length - 1 && (
                  <MenuItem icon={<FaArrowDown />} onClick={handleDown}>
                    {getTranslated("Move down")}
                  </MenuItem>
                )}
                <MenuItem icon={<FaCode />} onClick={handleClickEditId}>
                  <Translate>View/change ID</Translate>
                </MenuItem>
                <MenuItem icon={<FaTrash />} onClick={handleDelete}>
                  {getTranslated("Delete")}
                </MenuItem>
              </Menu>
            }
          </Dropdown>
        </GridField>
        <GridField label="Fields">
          {Object.entries(settings.equipmentCategories[id].fields).map(
            ([fieldId, field], fieldIdx) => {
              return (
                <Field
                  key={fieldId}
                  fieldId={fieldId}
                  field={field}
                  categoryId={id}
                  idx={fieldIdx} //
                />
              );
            },
          )}
          <button onClick={handleAddField}>
            <i className="fas fa-plus" />
            <Translate>Add Field</Translate>
          </button>
        </GridField>
      </InputGrid>
      <hr
        css={{
          margin: "1em 0 2em 0",
        }}
      />
    </>
  );
};

Category.displayName = "Category";
