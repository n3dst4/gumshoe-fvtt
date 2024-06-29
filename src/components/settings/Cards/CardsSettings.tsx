import React, { useCallback, useContext } from "react";

import { Checkbox } from "../../inputs/Checkbox";
import { GridField } from "../../inputs/GridField";
import { GridFieldStacked } from "../../inputs/GridFieldStacked";
import { InputGrid } from "../../inputs/InputGrid";
import { StateContext } from "../contexts";
// import { store } from "../store";
import { Setters } from "../types";
import { Categories } from "./Categories";

interface CardsSettingsProps {
  setters: Setters;
}

export const CardsSettings: React.FC<CardsSettingsProps> = ({ setters }) => {
  const { settings } = useContext(StateContext);

  const handleChangeUseCards = useCallback(
    (checked: boolean) => {
      setters.useCards(checked);
    },
    [setters],
  );

  return (
    <InputGrid
      css={{
        flex: 1,
        overflow: "auto",
      }}
    >
      <GridField label="Use cards?">
        <Checkbox checked={settings.useCards} onChange={handleChangeUseCards} />
      </GridField>
      {settings.useCards && (
        <>
          <GridFieldStacked>
            <hr />
          </GridFieldStacked>
          <GridFieldStacked label="Card categories">
            <Categories />
          </GridFieldStacked>
        </>
      )}
    </InputGrid>
    // <div>
    //   {settings.cardCategories.map(({ name }) => (
    //     <div key={name}>{name}</div>
    //   ))}
    // </div>
  );
};

CardsSettings.displayName = "CardsSettings";
