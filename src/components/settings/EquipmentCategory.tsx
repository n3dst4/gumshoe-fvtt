import React, { useCallback } from "react";
import { SettingsDict } from "../../settings";
import { AsyncTextInput } from "../inputs/AsyncTextInput";
import { GridField } from "../inputs/GridField";
import { InputGrid } from "../inputs/InputGrid";
import { Setters } from "./Settings";

interface EquipmentCategoryProps {
  setters: Setters;
  tempSettingsRef: React.MutableRefObject<SettingsDict>;
  idx: number;
}

export const EquipmentCategory: React.FC<EquipmentCategoryProps> = ({
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

  return (
    <>
    <InputGrid>
      <GridField label="Name">
        <AsyncTextInput
          value={tempSettingsRef.current.equipmentCategories[idx].name}
          onChange={handleNameChange}
        />
      </GridField>
    </InputGrid>
    <hr/>
  </>
  );
};

EquipmentCategory.displayName = "EquipmentCategory";
