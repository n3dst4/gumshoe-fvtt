import React from "react";
import { assertGame } from "../../functions";
import { SettingsDict } from "../../settings";
import { InputGrid } from "../inputs/InputGrid";
import { EquipmentCategory } from "./EquipmentCategory";
import { Setters } from "./Settings";

export const EquipmentSettings: React.FC<{
  tempSettings: SettingsDict,
  setters: Setters,
  tempSettingsRef: React.MutableRefObject<SettingsDict>,
}> = ({ tempSettings, setters, tempSettingsRef }) => {
  assertGame(game);

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
      </InputGrid>
    </>
  );
};

EquipmentSettings.displayName = "CoreSettings";
