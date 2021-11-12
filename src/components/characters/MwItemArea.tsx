/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useCallback, useContext } from "react";
import { mwItem } from "../../constants";
import { sortEntitiesByName } from "../../functions";
import { InvestigatorActor } from "../../module/InvestigatorActor";
import { ActorSheetAppContext } from "../FoundryAppContext";
import { Translate } from "../Translate";

type MwItemAreaProps = {
  actor: InvestigatorActor,
};

export const MwItemArea: React.FC<MwItemAreaProps> = ({
  actor,
}) => {
  const app = useContext(ActorSheetAppContext);

  const onDragStart = useCallback((e: React.DragEvent<HTMLAnchorElement>) => {
    if (app !== null) {
      (app as any)._onDragStart(e);
    }
  }, [app]);

  const items = actor.getMwItems();
  return (
    <div>
      <div>
        <h1
          css={{
            display: "inline",
          }}
        >
          <Translate>Tweaks</Translate>
        </h1>
        <button
          css={{
            float: "right",
            width: "auto",
          }}
          onClick={async () => {
            await actor.createEmbeddedDocuments("Item", [{
              type: mwItem,
              name: "New item",
            }], {
              renderSheet: true,
            });
          }}
        >
          <i className="fa fa-plus"/><Translate>Add Item</Translate>
        </button>
      </div>
      {items.tweak.length === 0 &&
        <i
          css={{
            display: "block",
            fontSize: "1.2em",
          }}
        >
          <Translate>No items yet.</Translate>
        </i>
      }

      <div
        css={{
          columns: "auto 12em",
        }}
      >
        {
          sortEntitiesByName(items.tweak).map<JSX.Element>((item) => (
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
