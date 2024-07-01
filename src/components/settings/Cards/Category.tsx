import { useParams } from "@lumphammer/minirouter";
import React, { useContext } from "react";

import { AsyncTextInput } from "../../inputs/AsyncTextInput";
import { GridField } from "../../inputs/GridField";
import { InputGrid } from "../../inputs/InputGrid";
import { DispatchContext, StateContext } from "../contexts";
import { store } from "../store";
import { cardCategory } from "./directions";

export const Category: React.FC = () => {
  const id = useParams(cardCategory);
  const { settings } = useContext(StateContext);
  const category = settings.cardCategories.find((c) => c.id === id);
  const dispatch = useContext(DispatchContext);

  const handleNameChange = (newName: string) => {
    dispatch(store.creators.renameCardCategory({ id, newName }));
  };

  return (
    <>
      <h3>{category?.name}</h3>
      <InputGrid>
        <GridField label="Item Name">
          <AsyncTextInput value={category?.name} onChange={handleNameChange} />
        </GridField>
      </InputGrid>
    </>
  );
};

Category.displayName = "Category";
