import { useNavigationContext } from "@lumphammer/minirouter";
import { useCallback, useContext } from "react";

import { confirmADoodleDo } from "../../../functions/confirmADoodleDo";
import { Button } from "../../inputs/Button";
import { GridField } from "../../inputs/GridField";
import { InputGrid } from "../../inputs/InputGrid";
import { Translate } from "../../Translate";
import { DispatchContext } from "../contexts";
import { useStateSelector } from "../hooks";
import { store } from "../store";
import { cardCategory, categoryDangerZone } from "./directions";

type CategoryDangerZoneProps = {
  id: string;
};

export const CategoryDangerZone = ({ id }: CategoryDangerZoneProps) => {
  const dispatch = useContext(DispatchContext);
  const { navigate } = useNavigationContext();

  const { value: category, freeze } = useStateSelector((s) =>
    s.settings.cardCategories.find((c) => c.id === id),
  );

  const handleClickEditId = useCallback(() => {
    if (category === undefined) {
      return;
    }
    const newId = prompt(
      `Change ID string for "${category?.singleName}"\n\n` +
        "⚠️ Careful! This will break the link with anything that references this ID.",
      category.id,
    );
    if (newId) {
      freeze();
      dispatch(
        store.creators.setCardCategoryId({
          id: category?.id,
          newId,
        }),
      );
      navigate("root", [cardCategory(newId), categoryDangerZone()]);
    }
  }, [category, dispatch, freeze, navigate]);

  const handleDelete = useCallback(async () => {
    const aye = await confirmADoodleDo({
      message: "Delete category",
      confirmText: "Delete",
      cancelText: "Cancel",
      confirmIconClass: "fa-trash",
      resolveFalseOnCancel: true,
      values: {
        ActorName: category?.singleName ?? "",
      },
    });
    if (aye) {
      freeze();
      navigate("root", []);
      dispatch(store.creators.deleteCardCategory({ id }));
    }
  }, [category?.singleName, dispatch, freeze, id, navigate]);

  return (
    <>
      <h2>
        <Translate>Danger Zone</Translate> ({category?.singleName})
      </h2>
      <InputGrid>
        <GridField label="Unique Id">
          <code>{id}</code>{" "}
          <Button onClick={handleClickEditId}>
            <Translate>Edit</Translate>
          </Button>
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
