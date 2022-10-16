import React, { useCallback } from "react";
import { InvestigatorActor } from "../../module/InvestigatorActor";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import * as constants from "../../constants";
import { Translate } from "../Translate";
import { sortEntitiesByName } from "../../functions";

interface EquipmentCategoryProps {
  categoryId: string;
  // categoryMetadata: EquipmentCategoryMetadata,
  items: InvestigatorItem[];
  name: string;
  actor: InvestigatorActor;
  app: Application<ApplicationOptions>|null;
}

export const EquipmentCategory: React.FC<EquipmentCategoryProps> = ({
  categoryId,
  items,
  name,
  actor,
  app,
}) => {
  const onDragStart = useCallback((e: React.DragEvent<HTMLAnchorElement>) => {
    if (app !== null) {
      (app as any)._onDragStart(e);
    }
  }, [app]);

  return (
    <>
      <div
        css={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <h2
          css={{
            flex: 1,
            "&&": {
              margin: "0 0 0 0",
            },
          }}
        >
          {name}
        </h2>
        <button
          css={{
            flexBasis: "max-content",
            alignSelf: "flex-start",
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
      {items.length === 0 && (
        <i
          css={{
            display: "block",
            fontSize: "1.2em",
          }}
        >
          <Translate>No equipment yet.</Translate>
        </i>
      )}

      <div
        css={{
          columns: "auto 12em",
        }}
      >
        {sortEntitiesByName(items).map<JSX.Element>((item) => (
          <a
            key={item.id}
            css={{
              display: "block",
              position: "relative",
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
    </>
  );
};

EquipmentCategory.displayName = "EquipmentCategory";
