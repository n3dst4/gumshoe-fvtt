/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { Fragment } from "react";
import { generalAbility, investigativeAbility } from "../../constants";
import { sortEntitiesByName, isInvestigativeAbility } from "../../functions";
import { InvestigatorActor } from "../../module/InvestigatorActor";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { assertActiveCharacterDataSource, isAbilityDataSource } from "../../types";
import { AbilitySlugPlay } from "./AbilitySlugPlay";

type AbilitiesAreaMWProps = {
  actor: InvestigatorActor,
  flipLeftRight?: boolean,
};

export const AbilitiesAreaMW: React.FC<AbilitiesAreaMWProps> = ({
  actor,
  flipLeftRight,
}) => {
  assertActiveCharacterDataSource(actor.data);

  const investigativeAbilities: { [category: string]: InvestigatorItem[] } = {};
  const generalAbilities: { [category: string]: InvestigatorItem[] } = {};

  for (const item of actor.items.values()) {
    if (!isAbilityDataSource(item.data)) {
      continue;
    }
    if (isInvestigativeAbility(item) && item.data.data.rating === 0) {
      continue;
    }
    if (item.data.type === investigativeAbility) {
      const cat = item.data.data.category || "Uncategorised";
      if (investigativeAbilities[cat] === undefined) {
        investigativeAbilities[cat] = [];
      }
      investigativeAbilities[cat].push(item);
    } else if (item.type === generalAbility) {
      const cat = item.data.data.category || "Uncategorised";
      if (generalAbilities[cat] === undefined) {
        generalAbilities[cat] = [];
      }
      generalAbilities[cat].push(item);
    }
  }

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
          {Object.keys(investigativeAbilities).sort().map<JSX.Element>((cat) => (
            <Fragment
              key={cat}
            >
              <h2 css={{ gridColumn: "1 / -1" }}>{cat}</h2>
              {
                sortEntitiesByName(investigativeAbilities[cat]).map<JSX.Element>((ability) => (
                  <AbilitySlugPlay key={ability.id} ability={ability}/>
                ))
              }
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
          {Object.keys(generalAbilities).sort().map<JSX.Element>((cat) => (
            <Fragment
              key={cat}
            >
              <h2 css={{ gridColumn: "1 / -1" }}>{cat}</h2>
              {
                sortEntitiesByName(generalAbilities[cat]).map<JSX.Element>((ability) => (
                  <AbilitySlugPlay key={ability.id} ability={ability}/>
                ))
              }
            </Fragment>
          ))}
        </div>
      </div>
    </Fragment>
  );
};
