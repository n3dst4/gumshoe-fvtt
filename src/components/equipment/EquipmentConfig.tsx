import React, { useCallback } from "react";
import { assertGame, confirmADoodleDo } from "../../functions";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { settings } from "../../settings";
import { assertEquipmentDataSource } from "../../typeAssertions";
import { GridField } from "../inputs/GridField";
import { GridFieldStacked } from "../inputs/GridFieldStacked";
import { InputGrid } from "../inputs/InputGrid";
import { Translate } from "../Translate";
import { OrphanedField } from "./OrphanedField";

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

  const allFields = equipment.data.data.fields;
  const knownFieldIds = Object.keys(
    settings.equipmentCategories.get()[equipment.data.data.category]?.fields ??
      {},
  );
  const unknownFields = Object.keys(allFields).filter(
    (fieldId) => !knownFieldIds.includes(fieldId),
  );

  return (
    <InputGrid>
      <GridField label="Category Id">
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
      <GridFieldStacked
        label="Orphaned fields"
        css={{
          display: "grid",
          gridTemplateColumns: "auto auto auto auto",
          gridAutoRows: "auto",
          maxWidth: "100%",
          gap: "0.2em 2em",
        }}
      >
        {unknownFields.length === 0 && (
          <i css={{ margin: "1em" }}>
            <Translate>No Orphaned Fields</Translate>
          </i>
        )}
        {unknownFields.map((fieldId, index) => (
          <OrphanedField
            key={index}
            fieldId={fieldId}
            fieldValue={allFields[fieldId]}
            index={index}
            onDelete={(id) => {
              equipment.deleteField(id);
            }}
          />
        ))}
      </GridFieldStacked>

      <GridFieldStacked label="Delete">
        <button onClick={onClickDelete}>
          <Translate>Delete Item</Translate>
        </button>
      </GridFieldStacked>
    </InputGrid>
  );
};

EquipmentConfig.displayName = "EquipmentConfig";
