import React, { Fragment, useCallback } from "react";
import { assertGame, confirmADoodleDo } from "../../functions";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { settings } from "../../settings";
import { assertEquipmentDataSource } from "../../typeAssertions";
import { GridField } from "../inputs/GridField";
import { GridFieldStacked } from "../inputs/GridFieldStacked";
import { InputGrid } from "../inputs/InputGrid";
import { Translate } from "../Translate";

interface EquipmentConfigProps {
  equipment: InvestigatorItem;
}

const gridRowsPerField = 3;

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
          <Fragment key={fieldId}>
            <div
              css={{
                gridColumn: "1",
                gridRow: index * gridRowsPerField + 1,
              }}
            >
              Id
            </div>
            <code
              css={{
                gridColumn: 2,
                gridRow: index * gridRowsPerField + 1,
              }}
            >
              {fieldId}
            </code>
            <a
              title="Copy field ID to clipboard"
              css={{
                gridColumn: 3,
                gridRow: index * gridRowsPerField + 1,
              }}
              onClick={() => {
                navigator.clipboard.writeText(fieldId);
                ui.notifications?.info(
                  `Copied field ID "${fieldId}" to clipboard`,
                );
              }}
            >
              <i className={"fa fa-copy"} />
            </a>
            <div
              css={{
                gridColumn: "1",
                gridRow: index * gridRowsPerField + 2,
              }}
            >
              Value
            </div>
            <code
              css={{
                gridColumn: 2,
                gridRow: index * gridRowsPerField + 2,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {allFields[fieldId]}
            </code>
            <a
              title="Copy field value to clipboard"
              css={{
                gridColumn: 3,
                gridRow: index * gridRowsPerField + 2,
              }}
              onClick={() => {
                navigator.clipboard.writeText(String(allFields[fieldId]));
                ui.notifications?.info("Copied value to clipboard");
              }}
            >
              <i className={"fa fa-copy"} />
            </a>
            <button
              css={{
                gridColumn: 4,
                gridRow: `${index * gridRowsPerField + 1} / ${
                  index * gridRowsPerField + 3
                }`,
              }}
              onClick={() => {
                equipment.deleteField(fieldId);
              }}
            >
              <Translate>Delete</Translate>
            </button>
            <hr
              css={{
                gridColumn: "1 / -1",
                gridRow: index * gridRowsPerField + 3,
              }}
            />
          </Fragment>
        ))}
      </GridFieldStacked>

      <GridField label="Delete">
        <button onClick={onClickDelete}>
          <Translate>Delete</Translate>
        </button>
      </GridField>
    </InputGrid>
  );
};

EquipmentConfig.displayName = "EquipmentConfig";
