import React, { useCallback } from "react";
import { assertGame, confirmADoodleDo } from "../../functions";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { assertEquipmentDataSource } from "../../typeAssertions";
import { GridField } from "../inputs/GridField";
import { InputGrid } from "../inputs/InputGrid";
import { Translate } from "../Translate";

interface EquipmentConfigProps {
  equipment: InvestigatorItem;
}

export const EquipmentConfig: React.FC<EquipmentConfigProps> = ({
  equipment,
}) => {
  assertEquipmentDataSource(equipment.data);

  const onClickDelete = useCallback(() => {
    assertGame(game);
    const message = equipment.actor
      ? "DeleteActorNamesEquipmentName"
      : "DeleteEquipmentName";

    confirmADoodleDo({
      message,
      confirmText: "Delete",
      cancelText: "Cancel",
      confirmIconClass: "fa-trash",
      values: {
        ActorName: equipment.actor?.data.name ?? "",
        EquipmentName: equipment.data.name,
      },
    }).then(() => {
      equipment.delete();
    });
  }, [equipment]);

  return (
    <InputGrid>
      <GridField label="Category Id" noTranslate>
        <code
          css={{
            display: "inline-block",
            margin: "0.3em 1em 0.3em 0",

          }}
        >
          {equipment.data.data.category}
        </code>
        <a
          css={{
            gridArea: "cog",
          }}
          onClick={() => {
            assertEquipmentDataSource(equipment.data);
            navigator.clipboard.writeText(equipment.data.data.category);
            ui.notifications?.info(
              `Copied category ID "${equipment.data.data.category}" to clipboard`,
            );
          }}
        >
          <i className={"fa fa-copy"} />
        </a>
      </GridField>

      <GridField label="Delete">
        <button onClick={onClickDelete}>
          <Translate>Delete</Translate>
        </button>
      </GridField>
    </InputGrid>
  );
};

EquipmentConfig.displayName = "EquipmentConfig";
