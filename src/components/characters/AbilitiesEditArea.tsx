/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { Fragment, useCallback, useContext } from "react";
import { generalAbility, investigativeAbility } from "../../constants";
import { sortEntitiesByName } from "../../functions";
import { GumshoeActor } from "../../module/GumshoeActor";
import { GumshoeItem } from "../../module/GumshoeItem";
import { ThemeContext } from "../../theme";
import { assertActiveCharacterDataSource, isAbilityDataSource } from "../../types";
import { Checkbox } from "../inputs/Checkbox";
import { Translate } from "../Translate";
import { AbilityEditSlug } from "./AbilityEditSlug";

type AbilitiesEditAreaProps = {
  actor: GumshoeActor,
  flipLeftRight?: boolean,
};

export const AbilitiesEditArea: React.FC<AbilitiesEditAreaProps> = ({
  actor,
  flipLeftRight,
}) => {
  assertActiveCharacterDataSource(actor.data);
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
          gridTemplateAreas: (flipLeftRight) ? "'general investigative'" : "'investigative general'",
          columnGap: "1em",
        }}
      >
        <div
          css={{
            gridArea: "investigative",
            display: "grid",
            gridTemplateAreas: "'ability rating isocc'",
            gridTemplateColumns: "max-content max-content 2em",
            columnGap: "0.5em",
            alignItems: "center",
            height: "0",
          }}
        >
          <label css={{ gridColumn: "rating" }}>Rating</label>
          <label css={{ gridColumn: "isocc" }} title="Occupational ability">
            Occ.
          </label>
          {Object.keys(investigativeAbilities).sort().map<JSX.Element>((cat) => (
            <Fragment
              key={cat}
            >
              <h2 css={{ gridColumn: "1 / -1" }}>{cat}</h2>
              {
                sortEntitiesByName(investigativeAbilities[cat]).map<JSX.Element>((ability) => (
                  <AbilityEditSlug key={ability.id} ability={ability}/>
                ))
              }
            </Fragment>
          ))}
        </div>
        <div
          css={{
            gridArea: "general",
            display: "grid",
            gridTemplateColumns: "max-content max-content 2em 2em",
            gridTemplateAreas: "'ability rating isocc canbeinv'",
            columnGap: "0.5em",
            alignItems: "center",
            height: "0",
          }}
        >
          <label css={{ gridColumn: "rating" }}>Rating</label>
          <label css={{ gridColumn: "isocc" }} title="Occupational ability">
            Occ.
          </label>
          <label css={{ gridColumn: "canbeinv" }} title="Can be used as Investigative Ability">
            Inv.
          </label>
          {Object.keys(generalAbilities).sort().map<JSX.Element>((cat) => (
            <Fragment
              key={cat}
            >
              <h2 css={{ gridColumn: "1 / span 4" }}>{cat}</h2>
              {
                sortEntitiesByName(generalAbilities[cat]).map<JSX.Element>((ability) => (
                  <AbilityEditSlug key={ability.id} ability={ability}/>
                ))
              }
            </Fragment>
          ))}
        </div>
      </div>
    </Fragment>
  );
};
