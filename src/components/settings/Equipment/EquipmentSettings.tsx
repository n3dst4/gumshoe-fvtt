import React, { MouseEventHandler, useCallback } from "react";
import { assertGame } from "../../../functions";
import { SettingsDict } from "../../../settings";
import { InputGrid } from "../../inputs/InputGrid";
import { EquipmentCategory } from "./Category";
import { Setters } from "../types";
import { GridFieldStacked } from "../../inputs/GridFieldStacked";
import { Translate } from "../../Translate";

interface EquipmentSettingsProps {
  tempSettings: SettingsDict;
  setters: Setters;
  tempSettingsRef: React.MutableRefObject<SettingsDict>;
}

export const EquipmentSettings: React.FC<EquipmentSettingsProps> = ({
  tempSettings,
  setters,
  tempSettingsRef,
}) => {
  assertGame(game);

  const handleAdd: MouseEventHandler = useCallback(
    (e) => {
      e.preventDefault();
      const newCats = [
        ...tempSettingsRef.current.equipmentCategories,
        { name: "", fields: [] },
      ];
      setters.equipmentCategories(newCats);
    },
    [setters, tempSettingsRef],
  );
  // let idx = 0;

  return (
    <>
      <h2>Categories</h2>
      {tempSettings.equipmentCategories.map(({ name, fields }, idx) => {
        return (
          <EquipmentCategory
            key={idx}
            idx={idx}
            setters={setters}
            tempSettingsRef={tempSettingsRef}
          />
        );
      })}
      <InputGrid
        css={{
          flex: 1,
          overflow: "auto",
        }}
      >
        <GridFieldStacked>
          <button onClick={handleAdd}>
            <i className="fas fa-plus" />
            <Translate>Add Category</Translate>
          </button>
        </GridFieldStacked>
      </InputGrid>
    </>
  );
};

EquipmentSettings.displayName = "CoreSettings";
