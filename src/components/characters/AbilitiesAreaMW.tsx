/** @jsx jsx */
import { jsx } from "@emotion/react";
import React from "react";
import { sortEntitiesByName } from "../../functions";
import { InvestigatorActor } from "../../module/InvestigatorActor";
import { assertActiveCharacterDataSource } from "../../types";
import { AbilitySlugPlayMw } from "./AbilitySlugPlayMw";
import { NoAbilitiesNote } from "./NoAbilitiesNote";
import { useAbilities } from "./useAbilities";

type AbilitiesAreaMWProps = {
  actor: InvestigatorActor,
};

export const AbilitiesAreaMW: React.FC<AbilitiesAreaMWProps> = ({
  actor,
}) => {
  assertActiveCharacterDataSource(actor.data);
  const { generalAbilities } = useAbilities(actor, true);

  return (
    <div
      css={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        columnGap: "1em",
      }}
    >
      {Object.keys(generalAbilities).map<JSX.Element>((cat) => (
        <div
          key={cat}
          css={{
            display: "grid",
            gridTemplateColumns: "1fr max-content max-content max-content",
            gridTemplateAreas: "'ability rating set spend'",
            gridAutoRows: "min-content",
            columnGap: "0.2em",
            rowGap: "0.4em",
            alignItems: "center",
            // height: "0",
          }}
            >
          <h2 css={{ gridColumn: "1 / -1" }}>{cat}</h2>
          {
            sortEntitiesByName(generalAbilities[cat]).map<JSX.Element>((ability) => (
              <AbilitySlugPlayMw key={ability.id} ability={ability}/>
            ))
          }
          {generalAbilities[cat].length === 0 && <NoAbilitiesNote />}
        </div>
      ))}
    </div>
  );
};
