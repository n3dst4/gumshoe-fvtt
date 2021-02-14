/** @jsx jsx */
import { jsx } from "@emotion/react";
import React from "react";
import { equipment } from "../../constants";
import { sortEntitiesByName } from "../../functions";
import { TrailActor } from "../../module/TrailActor";

type EquipmentAreaProps = {
  actor: TrailActor,
};

export const EquipmentArea: React.FC<EquipmentAreaProps> = ({
  actor,
}) => {
  const items = actor.getEquipment();
  return (
    <div>
      <div>
        <h1
          css={{
            display: "inline",
          }}
        >
          Equipment
        </h1>
        <button
          css={{
            float: "right",
            width: "auto",
          }}
          onClick={async () => {
            await actor.createOwnedItem({
              type: equipment,
              name: "New item",
            }, {
              renderSheet: true,
            });
            // newItem.sheet.render(true);
          }}
        >
          <i className="fa fa-plus"/>Add Equipment
        </button>
      </div>
      {items.length === 0 &&
        <i
          css={{
            display: "block",
            fontSize: "1.2em",
          }}
        >
          No equipment yet.
        </i>
      }

      <div
        css={{
          columns: "auto 12em",
        }}
      >
        <div
          css={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gridAutoRows: "min-content",
            columnGap: "1em",
            rowGap: "0.5em",
          }}
        >
          {
            sortEntitiesByName(items).map((item) => (
              <a
                key={item.id}
                onClick={() => item.sheet.render(true)}
              >
                {item.name}
              </a>
            ))
          }
        </div>
      </div>
    </div>
  );
};
