import React, { Fragment, useCallback, useContext } from "react";

import { generalAbility, investigativeAbility } from "../../constants";
import { sortEntitiesByName } from "../../functions/utilities";
import { InvestigatorActor } from "../../module/InvestigatorActor";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { ThemeContext } from "../../themes/ThemeContext";
import { assertActiveCharacterActor, isAbilityItem } from "../../v10Types";
import { Checkbox } from "../inputs/Checkbox";
import { Translate } from "../Translate";
import { AbilitySlug } from "./AbilitySlug";

type AbilitiesAreaProps = {
  actor: InvestigatorActor;
  flipLeftRight?: boolean;
};

export const AbilitiesArea: React.FC<AbilitiesAreaProps> = ({
  actor,
  flipLeftRight,
}) => {
  assertActiveCharacterActor(actor);
  const theme = useContext(ThemeContext);

  const investigativeAbilities: { [category: string]: InvestigatorItem[] } = {};
  const generalAbilities: { [category: string]: InvestigatorItem[] } = {};

  const hideZeroRated = actor.system.hideZeroRated;

  for (const item of actor.items.values()) {
    if (!isAbilityItem(item)) {
      continue;
    }
    if (hideZeroRated && item.system.rating === 0) {
      continue;
    }
    if (item.type === investigativeAbility) {
      const cat = item.system.category || "Uncategorised";
      if (investigativeAbilities[cat] === undefined) {
        investigativeAbilities[cat] = [];
      }
      investigativeAbilities[cat].push(item);
    } else if (item.type === generalAbility) {
      const cat = item.system.category || "Uncategorised";
      if (generalAbilities[cat] === undefined) {
        generalAbilities[cat] = [];
      }
      generalAbilities[cat].push(item);
    }
  }

  const onChangeHideZero = useCallback(
    (hideZeroRated: boolean) => {
      actor.update({ system: { hideZeroRated } });
    },
    [actor],
  );

  return (
    <Fragment>
      <label
        css={{
          display: "block",
          background: theme.colors.backgroundButton,
          padding: "0.3em",
          borderRadius: "0.3em",
        }}
      >
        <Checkbox checked={hideZeroRated} onChange={onChangeHideZero} />
        <Translate>Hide zero-rated abilities</Translate>
      </label>
      <div
        css={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateAreas: flipLeftRight
            ? "'general investigative'"
            : "'investigative general'",
          gridTemplateRows: "auto",
        }}
      >
        <div css={{ gridArea: "investigative" }}>
          {Object.keys(investigativeAbilities)
            .sort()
            .map<JSX.Element>((cat) => (
              <div key={cat}>
                <h2>{cat}</h2>
                {sortEntitiesByName(
                  investigativeAbilities[cat],
                ).map<JSX.Element>((ability) => (
                  <AbilitySlug key={ability.id} ability={ability} />
                ))}
              </div>
            ))}
        </div>
        <div css={{ gridArea: "general" }}>
          {Object.keys(generalAbilities)
            .sort()
            .map<JSX.Element>((cat) => (
              <div key={cat}>
                <h2>{cat}</h2>
                {sortEntitiesByName(generalAbilities[cat]).map<JSX.Element>(
                  (ability) => (
                    <AbilitySlug key={ability.id} ability={ability} />
                  ),
                )}
              </div>
            ))}
        </div>
      </div>
    </Fragment>
  );
};
