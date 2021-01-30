/** @jsx jsx */
import { jsx } from "@emotion/react";
import React from "react";
import { sortEntitiesByName } from "../../functions";
import { TrailItem } from "../../module/TrailItem";
import { AbilitySlug } from "./AbilitySlug";

type AbilitiesAreaProps = {
  investigativeAbilities: { [category: string]: TrailItem[] },
  generalAbilities: TrailItem[],
};

export const AbilitiesArea: React.FC<AbilitiesAreaProps> = ({
  investigativeAbilities,
  generalAbilities,
}) => {
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
