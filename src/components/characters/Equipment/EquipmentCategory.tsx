import React, { useCallback, useContext } from "react";
import { InvestigatorActor } from "../../../module/InvestigatorActor";
import { InvestigatorItem } from "../../../module/InvestigatorItem";
import { Translate } from "../../Translate";
import { sortEntitiesByName } from "../../../functions";
import { EquipmentFieldMetadata } from "@lumphammer/investigator-fvtt-types";
import { ThemeContext } from "../../../themes/ThemeContext";
import { EquipmentItemRow } from "./EquipmentItemRow";

interface EquipmentCategoryProps {
  categoryId: string;
  items: InvestigatorItem[];
  name: string;
  actor: InvestigatorActor;
  app: Application<ApplicationOptions> | null;
  fields: Record<string, EquipmentFieldMetadata>;
}

export const EquipmentCategory: React.FC<EquipmentCategoryProps> = ({
  categoryId,
  items,
  name,
  actor,
  app,
  fields,
}) => {
  const onDragStart = useCallback(
    (e: React.DragEvent<HTMLElement>) => {
      if (app !== null) {
        (app as any)._onDragStart(e);
      }
    },
    [app],
  );

  const theme = useContext(ThemeContext);

  return (
    <div
      css={{
        display: "grid",
        gridTemplateColumns: `1fr repeat(${Object.keys(fields).length}, 1fr)`,
        gridTemplateRows: "[title] auto [headers] auto [items] auto",
        // gap: "0.5em",
      }}
    >
      {/* Top row */}
      <div
        css={{
          gridColumn: "1/-1",
          gridRow: "title",
          display: "flex",
          flexDirection: "row",
          "&&": {
            margin: "0 0 0 0",
          },
        }}
      >
        <h2
          css={{
            flex: 1,
          }}
        >
          {name}
        </h2>
        {categoryId !== undefined && categoryId !== "" && (
          <button
            css={{
              flexBasis: "max-content",
            }}
            onClick={async () => {
              await actor.createEquipment(categoryId);
            }}
          >
            <i className="fa fa-plus" />
            <Translate>Add Equipment</Translate>
          </button>
        )}
      </div>

      {/* Headers */}
      <div
        css={{
          gridColumn: "1/-1",
          gridRow: "headers",
          borderBottom: `1px solid ${theme.colors.controlBorder}`,
        }}
      ></div>
      <div css={{ gridColumn: "1", gridRow: "headers" }}>
        <Translate>Item Name</Translate>
      </div>
      {Object.entries(fields).map<JSX.Element>(([fieldId, field], i) => {
        return (
          <div key={fieldId} css={{ gridColumn: i + 2, gridRow: "headers" }}>
            {field.name}
          </div>
        );
      })}

      {/* Nothing */}
      {items.length === 0 && (
        <i
          css={{
            gridColumn: "1 / -1",
            gridRow: "items",
            fontSize: "1.2em",
          }}
        >
          <Translate>No equipment yet.</Translate>
        </i>
      )}

      {/* Items */}
      {sortEntitiesByName(items).map<JSX.Element>((item, i) => (
        <EquipmentItemRow
          item={item}
          key={item.id}
          onDragStart={onDragStart}
          gridRow={i + 4}
          fields={fields}
        />
      ))}

      {/* Spacing */}
      <div
        css={{
          gridColumn: "1 / -1",
          gridRow: items.length + 4,
          height: "2em",
        }}
      />
    </div>
  );
};

EquipmentCategory.displayName = "EquipmentCategory";
