/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useCallback, useContext } from "react";
import { equipment } from "../../constants";
import { sortEntitiesByName } from "../../functions";
import { InvestigatorActor } from "../../module/InvestigatorActor";
import { ActorSheetAppContext } from "../FoundryAppContext";
import { Translate } from "../Translate";

type EquipmentAreaProps = {
  actor: InvestigatorActor,
};

export const EquipmentArea: React.FC<EquipmentAreaProps> = ({
  actor,
}) => {
  const app = useContext(ActorSheetAppContext);

  const onDragStart = useCallback((e: React.DragEvent<HTMLAnchorElement>) => {
    if (app !== null) {
      (app as any)._onDragStart(e);
    }
  }, [app]);

  const items = actor.getEquipment();
  return (
    <div>
      <div>
        <h1
          css={{
            display: "inline",
          }}
        >
          <Translate>Equipment</Translate>
        </h1>
        <button
          css={{
            float: "right",
            width: "auto",
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
