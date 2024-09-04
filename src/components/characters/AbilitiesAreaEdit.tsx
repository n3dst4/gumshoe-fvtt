import React, { Fragment, useContext } from "react";

import { sortEntitiesByName } from "../../functions/utilities";
import { InvestigatorActor } from "../../module/InvestigatorActor";
import { settings } from "../../settings/settings";
import { ThemeContext } from "../../themes/ThemeContext";
import { assertActiveCharacterActor } from "../../v10Types";
import { AbilitySlugEdit } from "./AbilitySlugEdit";
import { AbilitySlugEditQuickShockInvestigative } from "./AbilitySlugEditQuickShockInvestigative";
import { NoAbilitiesNote } from "./NoAbilitiesNote";
import { useAbilities } from "./useAbilities";

type AbilitiesAreaEditProps = {
  actor: InvestigatorActor;
  flipLeftRight?: boolean;
  showOcc?: boolean;
};

export const AbilitiesAreaEdit: React.FC<AbilitiesAreaEditProps> = ({
  actor,
  flipLeftRight,
  showOcc: showOccProp = true,
}) => {
  assertActiveCharacterActor(actor);
  const theme = useContext(ThemeContext);
  const { investigativeAbilities, generalAbilities } = useAbilities(
    actor,
    false,
    false,
  );
  const hideInv = settings.useMwStyleAbilities.get();
  const showOcc = showOccProp && !hideInv;

  const pushPoolWarnings = actor.getPushPoolWarnings();

  return (
    <Fragment>
      <div
        css={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateAreas:
            "'warnings warnings'" +
            (flipLeftRight || hideInv
              ? "'general investigative'"
              : "'investigative general'"),
          columnGap: "1em",
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
        {!hideInv && (
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
            {Object.keys(investigativeAbilities).map<JSX.Element>((cat) => (
              <Fragment key={cat}>
                <h2 css={{ gridColumn: "1 / -1" }}>{cat}</h2>
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
                        showOcc={showOcc}
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
          {Object.keys(generalAbilities).map<JSX.Element>((cat) => (
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
              {generalAbilities[cat].length === 0 && <NoAbilitiesNote />}
            </Fragment>
          ))}
        </div>
      </div>
    </Fragment>
  );
};
