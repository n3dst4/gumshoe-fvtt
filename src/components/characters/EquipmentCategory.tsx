import React, { useCallback } from "react";
import { InvestigatorActor } from "../../module/InvestigatorActor";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import * as constants from "../../constants";
import { Translate } from "../Translate";
import { sortEntitiesByName } from "../../functions";
import { EquipmentFieldMetadata } from "@lumphammer/investigator-fvtt-types";

interface EquipmentCategoryProps {
  categoryId: string;
  // categoryMetadata: EquipmentCategoryMetadata,
  items: InvestigatorItem[];
  name: string;
  actor: InvestigatorActor;
  app: Application<ApplicationOptions>|null;
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
  const onDragStart = useCallback((e: React.DragEvent<HTMLAnchorElement>) => {
    if (app !== null) {
      (app as any)._onDragStart(e);
    }
  }, [app]);

  return (
    <div
      css={{
        display: "grid",
        gridTemplateColumns: `1fr repeat(${Math.max(1, Object.keys(fields).length)}, 1fr)`,
        gridTemplateRows: "[hr] auto [title] auto [headers] auto [items] auto",
      }}
    >
      <div
        css={{
          gridColumn: "1 / -1",
          gridRow: "hr",
        }}
      >
        <hr />
      </div>
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
        <button
          css={{
            flexBasis: "max-content",
          }}
          onClick={async () => {
            await actor.createEmbeddedDocuments(
              "Item",
              [
                {
                  type: constants.equipment,
                  name: "New item",
                  data: {
                    category: categoryId,
                  },
                },
              ],
              {
                renderSheet: true,
              },
            );
          }}
        >
          <i className="fa fa-plus" />
          <Translate>Add Equipment</Translate>
        </button>
      </div>

      {/* Headers */}
      <div css={{ gridColumn: "1", gridRow: "headers" }}>
        <Translate>Name</Translate>
      </div>
      {Object.entries(fields).map<JSX.Element>(([fieldId, field], i) => {
        return <div key={fieldId} css={{ gridColumn: i + 2, gridRow: "headers" }}>{field.name}</div>;
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
        <a
          key={item.id}
          css={{
            gridColumn: "1",
            gridRow: i + 4,
          }}
          onClick={() => item.sheet?.render(true)}
          data-item-id={item.id}
          onDragStart={onDragStart}
          draggable="true"
        >
          {item.name}
        </a>
      ))}
    </div>
  );
};

EquipmentCategory.displayName = "EquipmentCategory";
