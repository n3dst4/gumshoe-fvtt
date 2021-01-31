/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { Fragment, useCallback, useContext } from "react";
import { generalAbility, investigativeAbility } from "../../constants";
import { sortEntitiesByName } from "../../functions";
import { TrailActor } from "../../module/TrailActor";
import { TrailItem } from "../../module/TrailItem";
import { ThemeContext } from "../../theme";
import { Checkbox } from "../inputs/Checkbox";
import { AbilitySlug } from "./AbilitySlug";

type AbilitiesAreaProps = {
  actor: TrailActor,
};

export const AbilitiesArea: React.FC<AbilitiesAreaProps> = ({
  actor,
}) => {
  const [theme] = useContext(ThemeContext);

  const investigativeAbilities: { [category: string]: TrailItem[] } = {};
  const generalAbilities: TrailItem[] = [];

  const hideZeroRated = actor.data.data.hideZeroRated;

  for (const item of actor.items.values()) {
    if (hideZeroRated && item.data.data.rating === 0) {
      continue;
    }
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

  const onChangeHideZero = useCallback((hideZeroRated: boolean) => {
    actor.update({ data: { hideZeroRated } });
  }, [actor]);

  return (
    <Fragment>
      <label
        css={{
          display: "block",
          background: theme.colors.reverseThin,
          padding: "0.3em",
          borderRadius: "0.3em",
        }}
      >
        <Checkbox
          checked={hideZeroRated}
          onChange={onChangeHideZero}
        />
        Hide zero-rated abilities
      </label>
      <div
        css={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateAreas: "'inv general'",
          gridTemplateRows: "auto",
        }}
      >
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
        <div css={{ gridArea: "general" }}>
          <h2>General</h2>
          {sortEntitiesByName(generalAbilities).map((ability) => (
            <AbilitySlug key={ability.id} ability={ability} />
          ))}
        </div>
      </div>
    </Fragment>
  );
};
