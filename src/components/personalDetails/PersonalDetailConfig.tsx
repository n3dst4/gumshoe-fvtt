import React, { useCallback } from "react";

import { confirmADoodleDo } from "../../functions/confirmADoodleDo";
import { assertGame } from "../../functions/utilities";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { Button } from "../inputs/Button";
import { GridFieldStacked } from "../inputs/GridFieldStacked";
import { InputGrid } from "../inputs/InputGrid";
import { Translate } from "../Translate";
interface PersonalDetailConfigProps {
  item: InvestigatorItem;
}

export const PersonalDetailConfig: React.FC<PersonalDetailConfigProps> = ({
  item,
}) => {
  const onClickDelete = useCallback(async () => {
    assertGame(game);
    const message = item.actor
      ? "DeleteActorNamesEquipmentName"
      : "DeleteEquipmentName";

    const aye = await confirmADoodleDo({
      message,
      confirmText: "Delete",
      cancelText: "Cancel",
      confirmIconClass: "fa-trash",
      values: {
        ActorName: item.actor?.name ?? "",
        EquipmentName: item.name ?? "",
      },
      resolveFalseOnCancel: true,
    });
    if (aye) {
      await item.delete();
    }
  }, [item]);

  return (
    <InputGrid>
      <GridFieldStacked label="Delete">
        <Button onClick={onClickDelete}>
          <Translate>Delete Item</Translate>
        </Button>
      </GridFieldStacked>
    </InputGrid>
  );
};

PersonalDetailConfig.displayName = "PersonaldetailConfig";
