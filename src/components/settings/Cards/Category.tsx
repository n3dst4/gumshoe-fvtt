import { useNavigationContext, useParams } from "@lumphammer/minirouter";
import React, { useCallback, useContext } from "react";

import { confirmADoodleDo } from "../../../functions/confirmADoodleDo";
import { AsyncTextInput } from "../../inputs/AsyncTextInput";
import { Button } from "../../inputs/Button";
import { GridField } from "../../inputs/GridField";
import { InputGrid } from "../../inputs/InputGrid";
import { Translate } from "../../Translate";
import { DispatchContext } from "../contexts";
import { useStateSelector } from "../hooks";
import { store } from "../store";
import { cardCategory } from "./directions";

export const Category: React.FC = () => {
  const id = useParams(cardCategory);
  const { value: category, freeze } = useStateSelector((s) =>
    s.settings.cardCategories.find((c) => c.id === id),
  );
  const dispatch = useContext(DispatchContext);
  const { navigate } = useNavigationContext();

  const handleNameChange = (newName: string) => {
    dispatch(store.creators.renameCardCategory({ id, newName }));
  };

  const handleDelete = useCallback(async () => {
    const aye = await confirmADoodleDo({
      message: "Delete category",
      confirmText: "Delete",
      cancelText: "Cancel",
      confirmIconClass: "fa-trash",
      resolveFalseOnCancel: true,
      values: {
        ActorName: category?.name ?? "",
      },
    });
    if (aye) {
      freeze();
      navigate("here", "up");
      dispatch(store.creators.deleteCardCategory({ id }));
    }
  }, [category?.name, dispatch, freeze, id, navigate]);

  return (
    <>
      <InputGrid>
        <GridField label="Item Name">
          <AsyncTextInput value={category?.name} onChange={handleNameChange} />
        </GridField>
        <GridField label="Delete">
          <Button onClick={handleDelete}>
            <Translate>Delete</Translate>
          </Button>
        </GridField>
      </InputGrid>
    </>
  );
};

Category.displayName = "Category";
