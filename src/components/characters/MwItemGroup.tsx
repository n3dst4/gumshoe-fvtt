/** @jsx jsx */
import { jsx } from "@emotion/react";
import React from "react";
import { mwItem } from "../../constants";
import { sortEntitiesByName } from "../../functions";
import { MwType } from "../../types";
import { Translate } from "../Translate";

interface MwItemGroupProps {
  actor: Actor;
  items: Item[];
  name: string;
  mwType: MwType;
  onDragStart: (e: React.DragEvent<HTMLAnchorElement>) => void;
}

export const MwItemGroup: React.FC<MwItemGroupProps> = ({
  actor,
  items,
  onDragStart,
  name,
  mwType,
}: MwItemGroupProps) => {
  return (
    <div>
      <div>
        <h1
          css={{
            display: "inline",
          }}
        >
          <Translate>{name}</Translate>
        </h1>
        <button
          css={{
            float: "right",
            width: "auto",
          }}
          onClick={async () => {
            await actor.createEmbeddedDocuments(
              "Item",
              [
                {
                  type: mwItem,
                  name: "New item",
                  data: {
                    mwType,
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
          <Translate>Add Item</Translate>
        </button>
      </div>
      {items.length === 0 && (
        <i
          css={{
            display: "block",
            fontSize: "1.2em",
          }}
        >
          <Translate>No items yet.</Translate>
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
    </div>
  );
};
