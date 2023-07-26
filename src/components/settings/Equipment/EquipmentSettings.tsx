import React, { MouseEventHandler, useCallback, useContext } from "react";

import { assertGame } from "../../../functions/utilities";
import { GridFieldStacked } from "../../inputs/GridFieldStacked";
import { InputGrid } from "../../inputs/InputGrid";
import { Translate } from "../../Translate";
import { DispatchContext, StateContext } from "../contexts";
import { store } from "../store";
import { Category } from "./Category";

export const EquipmentSettings: React.FC = () => {
  assertGame(game);
  const dispatch = useContext(DispatchContext);
  const handleAdd: MouseEventHandler = useCallback(
    (e) => {
      e.preventDefault();
      dispatch(store.creators.addCategory());
    },
    [dispatch],
  );
  const { settings } = useContext(StateContext);

  return (
    <>
      {Object.entries(settings.equipmentCategories).map(
        ([id, { name, fields }], idx) => {
          return <Category key={id} id={id} idx={idx} />;
        },
      )}
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

EquipmentSettings.displayName = "EquipmentSettings";
