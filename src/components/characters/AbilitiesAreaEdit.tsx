import React, { Fragment, useContext } from "react";

import { sortEntitiesByName } from "../../functions/utilities";
import { InvestigatorActor } from "../../module/InvestigatorActor";
import { settings } from "../../settings/settings";
import { ThemeContext } from "../../themes/ThemeContext";
import {
  assertActiveCharacterActor,
  isInvestigativeAbilityItem,
} from "../../v10Types";
import { AbilitySlugEdit } from "./AbilitySlugEdit";
import { AbilitySlugEditQuickShockInvestigative } from "./AbilitySlugEditQuickShockInvestigative";
import { NoAbilitiesNote } from "./NoAbilitiesNote";
import { useAbilities } from "./useAbilities";

type AbilitiesAreaEditProps = {
  actor: InvestigatorActor;
  npcMode?: boolean;
};

export const AbilitiesAreaEdit: React.FC<AbilitiesAreaEditProps> = ({
  actor,
  npcMode = false,
}) => {
  assertActiveCharacterActor(actor);
  const theme = useContext(ThemeContext);
  const { investigativeAbilities, generalAbilities } = useAbilities(
    actor,
    false,
    false,
  );

  // this is all a bit iffy-elsey, but...

  //  in MW mode, we hide the investigative abilities
  const mwMode = settings.useMwStyleAbilities.get();
  // we're in "simplified mode" if it's an NPC or we're using MW style
  const simplifiedMode = npcMode || mwMode;

  // even when not simplified, we hide the "occupational" column if there are
  // no non-quickshock investigative abilities
  const hasRegularInvestigativeAbilities = actor.items.some(
    (item) => isInvestigativeAbilityItem(item) && !item.system.isQuickShock,
  );
  const showInvestigativeOccupationalColumn =
    !simplifiedMode && hasRegularInvestigativeAbilities;

  // warnings from having weirdly set up push pools
  const pushPoolWarnings = actor.getPushPoolWarnings();

  return (
    <Fragment>
      <div
        css={{
          display: "grid",
          gridTemplateColumns: "minmax(33%, auto) minmax(33%, auto)",
          gridTemplateAreas:
            "'warnings warnings'" +
            (simplifiedMode
              ? "'general investigative'"
              : "'investigative general'"),
          columnGap: "1em",
          marginBottom: "1em",
        }}
      >
        <div css={{ gridArea: "warnings" }}>
          {pushPoolWarnings.map<JSX.Element>((warning, i) => (
            <div
              key={i}
              css={{
                background: theme.colors.danger,
                color: theme.colors.accentContrast,
                borderRadius: "0.5em",
                padding: "0.2em 0.7em",
                marginBottom: "0.5em",
              }}
            >
              ⚠️
              {warning}
            </div>
          ))}
        </div>
        {!mwMode && (
          <div
            css={{
              gridArea: "investigative",
              display: "grid",
              gridTemplateAreas: "'ability rating isocc'",
              gridTemplateColumns: showInvestigativeOccupationalColumn
                ? "1fr max-content auto"
                : "1fr max-content",
              columnGap: "0.5em",
              rowGap: "0.1em",
              alignItems: "center",
              alignContent: "start",
            }}
          >
            {simplifiedMode || (
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
            {showInvestigativeOccupationalColumn && (
              <i
                css={{
                  gridColumn: "isocc",
                  font: theme.displayFont,
                  fontSize: "smaller",
                }}
                title="Occupational Ability"
              >
                Oc.
              </i>
            )}
            {Object.keys(investigativeAbilities).map<JSX.Element>((cat) => (
              <Fragment key={cat}>
                <h2
                  css={{
                    gridColumn: "1 / -1",
                    borderWidth: "1px",
                    borderStyle: "none none solid none",
                    borderColor: theme.colors.text,
                  }}
                >
                  {cat}
                </h2>
                {sortEntitiesByName(
                  investigativeAbilities[cat],
                ).map<JSX.Element>((ability) => {
                  if (ability.system.isQuickShock) {
                    return (
                      <AbilitySlugEditQuickShockInvestigative
                        key={ability.id}
                        ability={ability}
                      />
                    );
                  } else {
                    return (
                      <AbilitySlugEdit
                        key={ability.id}
                        ability={ability}
                        showOcc={showInvestigativeOccupationalColumn}
                      />
                    );
                  }
                })}
                {investigativeAbilities[cat].length === 0 && (
                  <NoAbilitiesNote />
                )}
              </Fragment>
            ))}
          </div>
        )}

        <div
          css={{
            gridArea: "general",
            display: "grid",
            gridTemplateAreas: "'ability rating isocc'",
            gridTemplateColumns: simplifiedMode
              ? "1fr max-content"
              : "1fr max-content auto",
            columnGap: "0.5em",
            rowGap: "0.1em",
            alignItems: "center",
            alignContent: "start",
          }}
        >
          {simplifiedMode || (
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
          {simplifiedMode || (
            <i
              css={{
                gridColumn: "isocc",
                font: theme.displayFont,
                fontSize: "smaller",
              }}
              title="Occupational Ability"
            >
              Oc.
            </i>
          )}

          {Object.keys(generalAbilities).map<JSX.Element>((cat) => (
            <Fragment key={cat}>
              <h2
                css={{
                  gridColumn: "1 / -1",
                  borderWidth: "1px",
                  borderStyle: "none none solid none",
                  borderColor: theme.colors.text,
                }}
              >
                {cat}
              </h2>
              {sortEntitiesByName(generalAbilities[cat]).map<JSX.Element>(
                (ability) => (
                  <AbilitySlugEdit
                    key={ability.id}
                    ability={ability}
                    showOcc={!simplifiedMode}
                  />
                ),
              )}
              {generalAbilities[cat].length === 0 && <NoAbilitiesNote />}
            </Fragment>
          ))}
        </div>
      </div>
    </Fragment>
  );
};
