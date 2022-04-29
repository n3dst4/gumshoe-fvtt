/** @jsx jsx */
import { jsx } from "@emotion/react";
import React from "react";
import { weapon } from "../../constants";
import { sortEntitiesByName } from "../../functions";
import { InvestigatorActor } from "../../module/InvestigatorActor";
import { Translate } from "../Translate";
import { WeaponRowEdit } from "./WeaponRowEdit";

type WeaponsAreaEditProps = {
  actor: InvestigatorActor,
};

export const WeaponsAreaEdit: React.FC<WeaponsAreaEditProps> = ({
  actor,
}) => {
  const items = actor.getWeapons();
  return (
    <div>
      <div
        css={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <h1
          css={{
            flex: 1,
          }}
        >
          <Translate>Weapons</Translate>
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
                  type: weapon,
                  name: "A new weapon",
                  data: {
                    notes: {
                      format: "plain",
                    },
                  },
                },
              ]);
          }}
        >
          <i className="fa fa-plus"/><Translate>Add Weapon</Translate>
        </button>
      </div>
      {items.length === 0 &&
        <i
          css={{
            display: "block",
            fontSize: "1.2em",
          }}
        >
          <Translate>No weapons yet!</Translate>
        </i>
      }
      {items.length > 0 &&
        <div
          css={{
            display: "grid",
            gridTemplateColumns: "10em 1fr max-content min-content",
            gridAutoRows: "min-content",
            columnGap: "0.5em",
            whiteSpace: "nowrap",
            ".header": {
              fontWeight: "bold",
            },
          }}
        >
          <div className="header" css={{ gridColumn: 1, alignSelf: "end", gridRow: 1 }}>
            <Translate>Weapon</Translate>
          </div>
          <div className="header" css={{ gridColumn: 2, alignSelf: "end", gridRow: 1 }}>
            <div
              css={{
                // borderWidth: "1px 1px 0 1px",
                // borderRadius: "1em",
                // borderStyle: "solid",
              }}
            >
              <Translate>Damage</Translate>
            </div>
            <div><Translate>Base PB/CR/NR/LR</Translate></div>
          </div>
          <div className="header" css={{ gridColumn: 3, alignSelf: "end", gridRow: 1 }}>
            <Translate>Ammo</Translate>
          </div>
          {
            sortEntitiesByName(items).map<JSX.Element>((item, index) => (
              <WeaponRowEdit key={item.id} weapon={item} index={index}/>
            ))
          }
        </div>
      }
    </div>
  );
};
