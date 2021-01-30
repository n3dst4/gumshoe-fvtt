/** @jsx jsx */
import { jsx } from "@emotion/react";
import React from "react";
import { generalAbility, investigativeAbility } from "../../constants";
import { sortEntitiesByName } from "../../functions";
import { TrailActor } from "../../module/TrailActor";
import { TrailItem } from "../../module/TrailItem";
import { AbilitySlug } from "./AbilitySlug";

type AbilitiesAreaProps = {
  actor: TrailActor,
};

export const AbilitiesArea: React.FC<AbilitiesAreaProps> = ({
  actor,
}) => {
  const investigativeAbilities: { [category: string]: TrailItem[] } = {};
  const generalAbilities: TrailItem[] = [];

  for (const item of actor.items.values()) {
    if (item.type === investigativeAbility) {
      const ability = item as TrailItem;
      const cat = ability.data.data.category || "Uncategorised";
      if (investigativeAbilities[cat] === undefined) {
        investigativeAbilities[cat] = [];
      }
      investigativeAbilities[cat].push(ability);
    } else if (item.type === generalAbility) {
      generalAbilities.push(item as TrailItem);
    }
  }

  return (
    <div
      css={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridTemplateAreas: "'inv general'",
        gridTemplateRows: "auto",
      }}
    >
      <div css={{ gridArea: "general" }}>
        <h2>General</h2>
        {sortEntitiesByName(generalAbilities).map((ability) => (
          <AbilitySlug key={ability.id} ability={ability} />
        ))}
      </div>
      <div css={{ gridArea: "inv" }}>
        {Object.keys(investigativeAbilities).sort().map((cat) => (
          <div key={cat}>
            <h2>{cat}</h2>
            {
              sortEntitiesByName(investigativeAbilities[cat]).map((ability) => (
                <AbilitySlug key={ability.id} ability={ability}/>
              ))
            }
          </div>
        ))}
      </div>
    </div>
  );
};
