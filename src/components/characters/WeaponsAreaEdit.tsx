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
      <div>
        <h1
          css={{
            display: "inline",
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
            gridTemplateColumns: "1fr 11em max-content min-content",
            gridAutoRows: "min-content",
            columnGap: "0.5em",
            whiteSpace: "nowrap",
            ".header": {
              fontWeight: "bold",
            },
          }}
        >
          <div className="header" css={{ gridColumn: 1 }}>
            <Translate>Weapon</Translate>
          </div>
          <div className="header" css={{ gridColumn: 2, alignSelf: "center" }}>
            <Translate>Damage</Translate>
            <p><Translate>Base PB/CR/NR/LR</Translate></p>
          </div>
          <div className="header" css={{ gridColumn: 3 }}>
            <Translate>Ammo</Translate>
          </div>
          {
            sortEntitiesByName(items).map<JSX.Element>((item) => (
              <WeaponRowEdit key={item.id} weapon={item}/>
            ))
          }
        </div>
      }
    </div>
  );
};
