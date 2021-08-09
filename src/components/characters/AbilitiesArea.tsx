/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { Fragment, useCallback, useContext } from "react";
import { generalAbility, investigativeAbility } from "../../constants";
import { sortEntitiesByName } from "../../functions";
import { GumshoeActor } from "../../module/GumshoeActor";
import { GumshoeItem } from "../../module/GumshoeItem";
import { ThemeContext } from "../../theme";
import { Checkbox } from "../inputs/Checkbox";
import { Translate } from "../Translate";
import { AbilitySlug } from "./AbilitySlug";

type AbilitiesAreaProps = {
  actor: GumshoeActor,
};

export const AbilitiesArea: React.FC<AbilitiesAreaProps> = ({
  actor,
}) => {
  const theme = useContext(ThemeContext);

  const investigativeAbilities: { [category: string]: Item[] } = {};
  const generalAbilities: { [category: string]: Item[] } = {};

  const hideZeroRated = actor.data.data.hideZeroRated;

  for (const item of actor.items.values()) {
    if (hideZeroRated && item.data.data.rating === 0) {
      continue;
    }
    if (item.type === investigativeAbility) {
      const ability = item as GumshoeItem;
      const cat = ability.data.data.category || "Uncategorised";
      if (investigativeAbilities[cat] === undefined) {
        investigativeAbilities[cat] = [];
      }
      investigativeAbilities[cat].push(ability);
    } else if (item.type === generalAbility) {
      const ability = item as GumshoeItem;
      const cat = ability.data.data.category || "Uncategorised";
      if (generalAbilities[cat] === undefined) {
        generalAbilities[cat] = [];
      }
      generalAbilities[cat].push(ability);
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
          gridTemplateAreas: "'investigative general'",
          gridTemplateRows: "auto",
        }}
      >
        <div css={{ gridArea: "investigative" }}>
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
        <div css={{ gridArea: "general" }}>
          {Object.keys(generalAbilities).sort().map((cat) => (
            <div key={cat}>
              <h2>{cat}</h2>
              {
                sortEntitiesByName(generalAbilities[cat]).map((ability) => (
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
