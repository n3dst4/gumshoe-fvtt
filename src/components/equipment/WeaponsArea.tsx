/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { Fragment } from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { equipment, weapon } from "../../constants";
import { sortEntitiesByName } from "../../functions";
import { TrailActor } from "../../module/TrailActor";

type WeaponsAreaProps = {
  actor: TrailActor,
};

export const WeaponsArea: React.FC<WeaponsAreaProps> = ({
  actor,
}) => {
  const items = actor.getWeapons();
  return (
    <div>
      <h1>
        Weapons
        <button
          css={{
            float: "right",
            width: "auto",
          }}
          onClick={async () => {
            await actor.createOwnedItem({
              type: weapon,
              name: "New weapon",
            }, {
              renderSheet: true,
            });
          }}
        >
          <i className="fa fa-plus"/>Add
        </button>
      </h1>
      <div
        css={{
          display: "grid",
          gridTemplateColumns: "1fr max-content max-content max-content max-content max-content 1fr",
          gridAutoRows: "min-content",
          columnGap: "0.5em",
          whiteSpace: "nowrap",
          ".header": {
            fontWeight: "bold",
          },
          // rowGap: "0.5em",
        }}
      >
        <div className="header" css={{ gridColumn: 1 }}>
          Weapon
        </div>
        <div className="header" css={{ gridColumn: 2 }}>
          Damage
        </div>
        <div className="header" css={{ gridColumn: 3 }}>
          Point Blank
        </div>
        <div className="header" css={{ gridColumn: 4 }}>
          Close
        </div>
        <div className="header" css={{ gridColumn: 5 }}>
          Near
        </div>
        <div className="header" css={{ gridColumn: 6 }}>
          Long
        </div>
        <div className="header" css={{ gridColumn: 7 }}>
          Notes
        </div>

        {
          sortEntitiesByName(items).map((item) => (
            <Fragment key={item.id}>
              <a
                key={item.id}
                onClick={() => item.sheet.render(true)}
                css={{ gridColumn: 1 }}
              >
                {item.name}
              </a>
              <div css={{ gridColumn: 2 }}>
                {item.getter("damage")()}
              </div>
              <div css={{ gridColumn: 3 }}>
                {item.getter("pointBlankRange")()}
              </div>
              <div css={{ gridColumn: 4 }}>
                {item.getter("closeRange")()}
              </div>
              <div css={{ gridColumn: 5 }}>
                {item.getter("nearRange")()}
              </div>
              <div css={{ gridColumn: 6 }}>
                {item.getter("longRange")()}
              </div>
              <div css={{ gridColumn: 7, overflow: "hidden", textOverflow: "ellipsis" }}>
                {item.getter("notes")()}
              </div>
            </Fragment>
          ))
        }
      </div>
    </div>
  );
};
