import React, { useCallback } from "react";

import { confirmADoodleDo } from "../../functions/confirmADoodleDo";
import { assertGame } from "../../functions/utilities";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { settings } from "../../settings/settings";
import { assertEquipmentItem } from "../../v10Types";
import { Button } from "../inputs/Button";
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
  assertEquipmentItem(equipment);

  const onClickDelete = useCallback(async () => {
    assertGame(game);
    const message = equipment.actor
      ? "DeleteActorNamesEquipmentName"
      : "DeleteEquipmentName";

    const yes = await confirmADoodleDo({
      message,
      confirmText: "Delete",
      cancelText: "Cancel",
      confirmIconClass: "fa-trash",
      resolveFalseOnCancel: true,
      values: {
        ActorName: equipment.actor?.name ?? "",
        EquipmentName: equipment.name ?? "",
      },
    });
    if (yes) {
      await equipment.delete();
    }
  }, [equipment]);

  const allFields = equipment.system.fields;
  const knownFieldIds = Object.keys(
    settings.equipmentCategories.get()[equipment.system.category]?.fields ?? {},
  );
  const unknownFields = Object.keys(allFields).filter(
    (fieldId) => !knownFieldIds.includes(fieldId),
  );

  return (
    <InputGrid>
      <GridField label="Category Id">
        {equipment.system.category ? (
          <>
            <code
              css={{
                display: "inline-block",
                margin: "0.3em 1em 0.3em 0",
              }}
            >
              {equipment.system.category}
            </code>
            <a
              css={{
                gridArea: "cog",
              }}
              onClick={async () => {
                assertEquipmentItem(equipment);
                await navigator.clipboard.writeText(equipment.system.category);
                ui.notifications?.info(
                  `Copied category ID "${equipment.system.category}" to clipboard`,
                );
              }}
            >
              <i className={"fa fa-copy"} />
            </a>
          </>
        ) : (
          <i>None set</i>
        )}
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
              void equipment.deleteField(id);
            }}
          />
        ))}
      </GridFieldStacked>

      <GridFieldStacked label="Delete">
        <Button onClick={onClickDelete}>
          <Translate>Delete Item</Translate>
        </Button>
      </GridFieldStacked>
    </InputGrid>
  );
};

EquipmentConfig.displayName = "EquipmentConfig";
