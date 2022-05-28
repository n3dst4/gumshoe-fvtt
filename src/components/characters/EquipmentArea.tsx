/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useCallback, useContext } from "react";
import { equipment } from "../../constants";
import { sortEntitiesByName } from "../../functions";
import { InvestigatorActor } from "../../module/InvestigatorActor";
import { FoundryAppContext } from "../FoundryAppContext";
import { Translate } from "../Translate";

type EquipmentAreaProps = {
  actor: InvestigatorActor,
};

export const EquipmentArea: React.FC<EquipmentAreaProps> = ({
  actor,
}) => {
  const app = useContext(FoundryAppContext);

  const onDragStart = useCallback((e: React.DragEvent<HTMLAnchorElement>) => {
    if (app !== null) {
      (app as any)._onDragStart(e);
    }
  }, [app]);

  const items = actor.getEquipment();
  return (
    <div>
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
          <Translate>Equipment</Translate>
        </h2>
        <button
          css={{
            flexBasis: "max-content",
            alignSelf: "flex-start",
          }}
          onClick={async () => {
            await actor.createEmbeddedDocuments("Item", [{
              type: equipment,
              name: "New item",
            }], {
              renderSheet: true,
            });
            // newItem.sheet.render(true);
          }}
        >
          <i className="fa fa-plus"/><Translate>Add Equipment</Translate>
        </button>
      </div>
      {items.length === 0 &&
        <i
          css={{
            display: "block",
            fontSize: "1.2em",
          }}
        >
          <Translate>No equipment yet.</Translate>
        </i>
      }

      <div
        css={{
          columns: "auto 12em",
        }}
      >
        {
          sortEntitiesByName(items).map<JSX.Element>((item) => (
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
          ))
        }
      </div>
    </div>
  );
};
