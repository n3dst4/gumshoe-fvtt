import React, { useCallback } from "react";

import { confirmADoodleDo } from "../../functions/confirmADoodleDo";
import { assertGame } from "../../functions/utilities";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { assertCardItem } from "../../v10Types";
import { GridField } from "../inputs/GridField";
import { InputGrid } from "../inputs/InputGrid";

interface CardConfigProps {
  card: InvestigatorItem;
}

export const CardConfig: React.FC<CardConfigProps> = ({ card }) => {
  assertCardItem(card);
  const onClickDelete = useCallback(async () => {
    assertGame(game);
    const message = card.actor
      ? "DeleteActorNamesEquipmentName"
      : "DeleteEquipmentName";

    (await confirmADoodleDo({
      message,
      confirmText: "Delete",
      cancelText: "Cancel",
      confirmIconClass: "fa-trash",
      resolveFalseOnCancel: true,
      values: {
        ActorName: card.actor?.name ?? "",
        EquipmentName: card.name ?? "",
      },
    })) && (await card.delete());
  }, [card]);

  return (
    <InputGrid>
      <GridField label="Delete">
        <button onClick={onClickDelete}>Delete</button>
      </GridField>
    </InputGrid>
  );
};

CardConfig.displayName = "CardConfig";
