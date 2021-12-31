/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { Fragment } from "react";
import { sortEntitiesByName } from "../../functions";
import { InvestigatorActor } from "../../module/InvestigatorActor";
import { assertActiveCharacterDataSource } from "../../types";
import { AbilitySlugPlay } from "./AbilitySlugPlay";
import { NoAbilitiesNote } from "./NoAbilitiesNote";
import { useAbilities } from "./useAbilities";

type AbilitiesAreaPlayProps = {
  actor: InvestigatorActor,
  flipLeftRight?: boolean,
};

export const AbilitiesAreaPlay: React.FC<AbilitiesAreaPlayProps> = ({
  actor,
  flipLeftRight,
}) => {
  assertActiveCharacterDataSource(actor.data);
  const { investigativeAbilities, generalAbilities } = useAbilities(actor, true);

  return (
    <Fragment>
      <div
        css={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateAreas: (flipLeftRight) ? "'general investigative'" : "'investigative general'",
          columnGap: "1em",
        }}
      >
        <div
          css={{
            gridArea: "investigative",
            display: "grid",
            gridTemplateAreas: "'ability rating set spend'",
            gridTemplateColumns: "1fr max-content max-content max-content",
            columnGap: "0.2em",
            rowGap: "0.4em",
            alignItems: "center",
            height: "0",
          }}
        >
          {Object.keys(investigativeAbilities).map<JSX.Element>((cat) => (
            <Fragment
              key={cat}
            >
              <h2 css={{ gridColumn: "1 / -1" }}>{cat}</h2>
              {
                sortEntitiesByName(investigativeAbilities[cat]).map<JSX.Element>((ability) => (
                  <AbilitySlugPlay key={ability.id} ability={ability}/>
                ))
              }
              {investigativeAbilities[cat].length === 0 && <NoAbilitiesNote />}
            </Fragment>
          ))}
        </div>
        <div
          css={{
            gridArea: "general",
            display: "grid",
            gridTemplateColumns: "1fr max-content max-content max-content",
            gridTemplateAreas: "'ability rating set spend'",
            columnGap: "0.2em",
            rowGap: "0.4em",
            alignItems: "center",
            height: "0",
          }}
        >
          {Object.keys(generalAbilities).map<JSX.Element>((cat) => (
            <Fragment
              key={cat}
            >
              <h2 css={{ gridColumn: "1 / -1" }}>{cat}</h2>
              {
                sortEntitiesByName(generalAbilities[cat]).map<JSX.Element>((ability) => (
                  <AbilitySlugPlay key={ability.id} ability={ability}/>
                ))
              }
              {generalAbilities[cat].length === 0 && <NoAbilitiesNote />}

            </Fragment>
          ))}
        </div>
      </div>
    </Fragment>
  );
};
