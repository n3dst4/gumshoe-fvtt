import React, { useCallback } from "react";
import { assertGame, confirmADoodleDo } from "../../functions";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { GridFieldStacked } from "../inputs/GridFieldStacked";
import { InputGrid } from "../inputs/InputGrid";
import { Translate } from "../Translate";
interface PersonalDetailConfigProps {
  item: InvestigatorItem;
}

export const PersonalDetailConfig: React.FC<PersonalDetailConfigProps> = ({
  item,
}) => {
  const onClickDelete = useCallback(() => {
    assertGame(game);
    const message = item.actor
      ? "DeleteActorNamesEquipmentName"
      : "DeleteEquipmentName";

    confirmADoodleDo({
      message,
      confirmText: "Delete",
      cancelText: "Cancel",
      confirmIconClass: "fa-trash",
      values: {
        ActorName: item.actor?.data.name ?? "",
        EquipmentName: item.data.name,
      },
    }).then(() => {
      item.delete();
    });
  }, [item]);

  return (
    <InputGrid>
      <GridFieldStacked label="Delete">
        <button onClick={onClickDelete}>
          <Translate>Delete Item</Translate>
        </button>
      </GridFieldStacked>
    </InputGrid>
  );
};

PersonalDetailConfig.displayName = "PersonaldetailConfig";
