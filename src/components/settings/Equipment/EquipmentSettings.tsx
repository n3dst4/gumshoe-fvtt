import React, { MouseEventHandler, useCallback, useContext } from "react";
import { assertGame } from "../../../functions";
import { InputGrid } from "../../inputs/InputGrid";
import { EquipmentCategory } from "./Category";
import { GridFieldStacked } from "../../inputs/GridFieldStacked";
import { Translate } from "../../Translate";
import { DispatchContext, StateContext } from "../contexts";
import { slice } from "../reducer";

export const EquipmentSettings: React.FC = () => {
  assertGame(game);
  const dispatch = useContext(DispatchContext);
  const handleAdd: MouseEventHandler = useCallback((e) => {
    e.preventDefault();
    dispatch(slice.creators.addCategory());
  },
  [dispatch],
  );
  const { settings } = useContext(StateContext);

  return (
    <>
      <h2>Categories</h2>
      {settings.equipmentCategories.map(({ name, fields }, idx) => {
        return (
          <EquipmentCategory
            key={idx}
            idx={idx}
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
