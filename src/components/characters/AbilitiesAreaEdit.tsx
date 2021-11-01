/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { Fragment, useContext } from "react";
import { generalAbility, investigativeAbility } from "../../constants";
import { sortEntitiesByName } from "../../functions";
import { InvestigatorActor } from "../../module/InvestigatorActor";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { getMwHideInvestigative } from "../../settingsHelpers";
import { ThemeContext } from "../../themes/ThemeContext";
import { assertActiveCharacterDataSource, isAbilityDataSource } from "../../types";
import { AbilitySlugEdit } from "./AbilitySlugEdit";

type AbilitiesAreaEditProps = {
  actor: InvestigatorActor,
  flipLeftRight?: boolean,
  showOcc?: boolean,
};

export const AbilitiesAreaEdit: React.FC<AbilitiesAreaEditProps> = ({
  actor,
  flipLeftRight,
  showOcc = true,
}) => {
  assertActiveCharacterDataSource(actor.data);
  const theme = useContext(ThemeContext);

  const investigativeAbilities: { [category: string]: InvestigatorItem[] } = {};
  const generalAbilities: { [category: string]: InvestigatorItem[] } = {};

  for (const item of actor.items.values()) {
    if (!isAbilityDataSource(item.data)) {
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

  const hideInv = getMwHideInvestigative();

  return (
    <Fragment>
      <div
        css={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateAreas: flipLeftRight || hideInv
            ? "'general investigative'"
            : "'investigative general'",
          columnGap: "1em",
        }}
      >
        {!hideInv &&
          <div
            css={{
              gridArea: "investigative",
              display: "grid",
              gridTemplateAreas: showOcc
                ? "'isocc ability rating'"
                : "'ability rating'",
              gridTemplateColumns: showOcc
                ? "2em 1fr max-content"
                : "1fr max-content",
              columnGap: "0.5em",
              alignItems: "center",
              height: "0",
            }}
          >
            {showOcc && (
              <i
                css={{
                  gridColumn: "isocc",
                  font: theme.displayFont,
                  fontSize: "smaller",
                }}
                title="Occupational Ability"
              >
                Occ.
              </i>
            )}
            {showOcc && (
              <i
                css={{
                  gridColumn: "rating",
                  font: theme.displayFont,
                  fontSize: "smaller",
                }}
              >
                Rating
              </i>
            )}
            {Object.keys(investigativeAbilities)
              .sort()
              .map<JSX.Element>((cat) => (
                <Fragment key={cat}>
                  <h2 css={{ gridColumn: "1 / -1" }}>{cat}</h2>
                  {sortEntitiesByName(
                    investigativeAbilities[cat],
                  ).map<JSX.Element>((ability) => (
                    <AbilitySlugEdit
                      key={ability.id}
                      ability={ability}
                      showOcc={showOcc}
                    />
                  ))}
                </Fragment>
              ))}
          </div>
        }

        <div
          css={{
            gridArea: "general",
            display: "grid",
            gridTemplateAreas: showOcc
              ? "'isocc ability rating'"
              : "'ability rating'",
            gridTemplateColumns: showOcc
              ? "2em 1fr max-content"
              : "1fr max-content",
            columnGap: "0.5em",
            alignItems: "center",
            height: "0",
          }}
        >
          {showOcc && (
            <i
              css={{
                gridColumn: "isocc",
                font: theme.displayFont,
                fontSize: "smaller",
              }}
              title="Occupational Ability"
            >
              Occ.
            </i>
          )}
          {showOcc && (
            <i
              css={{
                gridColumn: "rating",
                font: theme.displayFont,
                fontSize: "smaller",
              }}
            >
              Rating
            </i>
          )}
          {Object.keys(generalAbilities)
            .sort()
            .map<JSX.Element>((cat) => (
              <Fragment key={cat}>
                <h2 css={{ gridColumn: "1 / -1" }}>{cat}</h2>
                {sortEntitiesByName(generalAbilities[cat]).map<JSX.Element>(
                  (ability) => (
                    <AbilitySlugEdit
                      key={ability.id}
                      ability={ability}
                      showOcc={showOcc}
                    />
                  ),
                )}
              </Fragment>
            ))}
        </div>
      </div>
    </Fragment>
  );
};
