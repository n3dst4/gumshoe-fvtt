/** @jsx jsx */
import { jsx } from "@emotion/react";
import React from "react";
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
  const i1Cats: string[] = [];
  const i2Cats: string[] = [];

  let i1Len = 0;
  let i2Len = 0;

  for (const cat of Object.keys(investigativeAbilities)) {
    const col = i2Len < i1Len ? 2 : 1;

    (col === 1 ? i1Cats : i2Cats).push(cat);
    if (col === 1) {
      i1Len += investigativeAbilities[cat].length;
    } else {
      i2Len += investigativeAbilities[cat].length;
    }
  }

  return (
    <div
      css={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gridTemplateAreas: "'inv1 inv2 general'",
        gridTemplateRows: "auto",
      }}
    >
      <div css={{ gridArea: "general" }}>
        <h2>General Abilities</h2>
        {generalAbilities.map((ability) => (
          <AbilitySlug key={ability.id} ability={ability} />
        ))}
      </div>
      <div css={{ gridArea: "inv1" }}>
        {i1Cats.map((cat) => (
          <div key={cat}>
            <h2>{cat}</h2>
            {
              investigativeAbilities[cat].map((ability) => (
                <AbilitySlug key={ability.id} ability={ability}/>
              ))
            }
          </div>
        ))}
      </div>
      <div css={{ gridArea: "inv2" }}>
        {i2Cats.map((cat) => (
          <div key={cat}>
            <h2>{cat}</h2>
            {
              investigativeAbilities[cat].map((ability) => (
                <AbilitySlug key={ability.id} ability={ability}/>
              ))
            }

          </div>
        ))}
      </div>
    </div>
  );
};
