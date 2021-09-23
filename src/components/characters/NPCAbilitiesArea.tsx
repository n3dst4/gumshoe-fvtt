/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { Fragment, useCallback, useContext } from "react";
import { generalAbility, investigativeAbility } from "../../constants";
import { sortEntitiesByName } from "../../functions";
import { GumshoeActor } from "../../module/GumshoeActor";
import { GumshoeItem } from "../../module/GumshoeItem";
import { ThemeContext } from "../../theme";
import { assertNPCDataSource, isAbilityDataSource } from "../../types";
import { Checkbox } from "../inputs/Checkbox";
import { Translate } from "../Translate";
import { AbilitySlug } from "./AbilitySlug";

type NPCAbilitiesAreaProps = {
  actor: GumshoeActor,
};

export const NPCAbilitiesArea: React.FC<NPCAbilitiesAreaProps> = ({
  actor,
}) => {
  assertNPCDataSource(actor.data);
  const theme = useContext(ThemeContext);

  const investigativeAbilities: { [category: string]: GumshoeItem[] } = {};
  const generalAbilities: { [category: string]: GumshoeItem[] } = {};

  const hideZeroRated = actor.data.data.hideZeroRated;

  for (const item of actor.items.values()) {
    if (!isAbilityDataSource(item.data)) {
      continue;
    }
    if (hideZeroRated && item.data.data.rating === 0) {
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

  const onChangeHideZero = useCallback((hideZeroRated: boolean) => {
    actor.update({ data: { hideZeroRated } });
  }, [actor]);

  return (
    <Fragment>
      <label
        css={{
          display: "block",
          background: theme.colors.bgTint,
          padding: "0.3em",
          borderRadius: "0.3em",
        }}
      >
        <Checkbox
          checked={hideZeroRated}
          onChange={onChangeHideZero}
        />
        <Translate>Hide zero-rated abilities</Translate>
      </label>
      <div
        css={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateAreas: "'general investigative'",
          gridTemplateRows: "auto",
        }}
      >
        <div css={{ gridArea: "general" }}>
          {Object.keys(generalAbilities).sort().map<JSX.Element>((cat) => (
            <div key={cat}>
              <h2>{cat}</h2>
              {
                sortEntitiesByName(generalAbilities[cat]).map<JSX.Element>((ability) => (
                  <AbilitySlug key={ability.id} ability={ability}/>
                ))
              }
            </div>
          ))}
        </div>
        <div css={{ gridArea: "investigative" }}>
          {Object.keys(investigativeAbilities).sort().map<JSX.Element>((cat) => (
            <div key={cat}>
              <h2>{cat}</h2>
              {
                sortEntitiesByName(investigativeAbilities[cat]).map<JSX.Element>((ability) => (
                  <AbilitySlug key={ability.id} ability={ability}/>
                ))
              }
            </div>
          ))}
        </div>
      </div>
    </Fragment>
  );
};
