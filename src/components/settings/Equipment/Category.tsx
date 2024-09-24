import { useCallback, useContext } from "react";
import {
  FaArrowDown,
  FaArrowUp,
  FaCode,
  FaEllipsisH,
  FaTrash,
} from "react-icons/fa";

import { confirmADoodleDo } from "../../../functions/confirmADoodleDo";
import { getTranslated } from "../../../functions/getTranslated";
import { AsyncTextInput } from "../../inputs/AsyncTextInput";
import { Button } from "../../inputs/Button";
import { Dropdown } from "../../inputs/Dropdown";
import { GridField } from "../../inputs/GridField";
import { InputGrid } from "../../inputs/InputGrid";
import { Menu, MenuItem } from "../../inputs/Menu";
import { Translate } from "../../Translate";
import { DispatchContext, StateContext } from "../contexts";
import { store } from "../store";
import { Field } from "./Field";

interface CategoryProps {
  id: string;
  idx: number;
}

export const Category = ({ id, idx }: CategoryProps) => {
  const dispatch = useContext(DispatchContext);
  const { settings } = useContext(StateContext);

  const handleNameChange = useCallback(
    (newName: string) => {
      dispatch(store.creators.renameCategory({ id, newName }));
    },
    [dispatch, id],
  );

  const handleAddField = useCallback(() => {
    dispatch(store.creators.addField({ categoryId: id }));
  }, [dispatch, id]);

  const handleUp = useCallback(() => {
    dispatch(store.creators.moveCategoryUp({ categoryId: id }));
  }, [dispatch, id]);

  const handleDown = useCallback(() => {
    dispatch(store.creators.moveCategoryDown({ categoryId: id }));
  }, [dispatch, id]);

  const handleDelete = useCallback(async () => {
    const aye = await confirmADoodleDo({
      message: "Delete Category",
      confirmText: "Delete",
      cancelText: "Whoops, No!",
      confirmIconClass: "fas fa-trash",
      resolveFalseOnCancel: true,
    });
    if (aye) {
      dispatch(store.creators.deleteCategory({ id }));
    }
  }, [dispatch, id]);

  const handleClickEditId = useCallback(() => {
    const newId = prompt(
      `Change ID string for "${settings.equipmentCategories[id].name}"\n\n` +
        "⚠️ Careful! This will remove category information from any equipment using the current ID.",
      id,
    );
    if (newId) {
      dispatch(
        store.creators.changeCategoryId({
          oldCategoryId: id,
          newCategoryId: newId,
        }),
      );
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
          <Button onClick={handleAddField}>
            <i className="fas fa-plus" />
            <Translate>Add Field</Translate>
          </Button>
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
