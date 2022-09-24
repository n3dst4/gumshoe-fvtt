import React, { useCallback } from "react";
import { SettingsDict } from "../../../settings";
import { AsyncTextInput } from "../../inputs/AsyncTextInput";
import { GridField } from "../../inputs/GridField";
import { InputGrid } from "../../inputs/InputGrid";
import { Translate } from "../../Translate";
import { Setters } from "../types";
import { Field } from "./Field";

interface CategoryProps {
  setters: Setters;
  tempSettingsRef: React.MutableRefObject<SettingsDict>;
  idx: number;
}
//
export const Category: React.FC<CategoryProps> = ({
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

  return (
    <>
      <InputGrid>
        <GridField label="Name">
          <AsyncTextInput
            value={tempSettingsRef.current.equipmentCategories[idx].name}
            onChange={handleNameChange}
          />
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
            <Translate>Add Category</Translate>
          </button>

        </GridField>
      </InputGrid>
      <hr />
    </>
  );
};

Category.displayName = "EquipmentCategory";
