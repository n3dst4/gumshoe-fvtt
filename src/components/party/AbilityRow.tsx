/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { Fragment } from "react";
import { confirmADoodleDo } from "../../functions";
import { InvestigatorActor } from "../../module/InvestigatorActor";
import { runtimeConfig } from "../../runtime";
import { settings } from "../../settings";
import { AbilityRowData } from "./types";

type AbilityRowProps = {
  abilityRowData: AbilityRowData,
  index: number,
  actors: InvestigatorActor[],
};

export const AbilityRow: React.FC<AbilityRowProps> = ({
  abilityRowData,
  index,
  actors,
}) => {
  const theme = runtimeConfig.themes[settings.defaultThemeName.get()] || runtimeConfig.themes.tealTheme;

  const zero = abilityRowData.total === 0;
  const odd = index % 2 === 0;

  const bg = zero
    ? odd
        ? theme.colors.bgTransDangerPrimary
        : theme.colors.bgTransDangerSecondary
    : odd
      ? theme.colors.backgroundPrimary
      : theme.colors.backgroundSecondary;
  const headerBg = zero
    ? odd
        ? theme.colors.bgOpaqueDangerPrimary
        : theme.colors.bgOpaqueDangerSecondary
    : odd
      ? theme.colors.bgOpaquePrimary
      : theme.colors.bgOpaqueSecondary;
  return (
    <Fragment>
      {/* Ability name */}
      <div css={{
        gridRow: index + 2,
        backgroundColor: headerBg,
        padding: "0.5em",
        textAlign: "left",
        position: "sticky",
        left: 0,
      }}>
        {abilityRowData.abilityDataSource.name}
      </div>

      {/* Ability scores */}
      {actors.map<JSX.Element|null>((actor, j) => {
        if (actor === undefined || actor.id === null) {
          return null;
        }
        const actorInfo = abilityRowData.actorInfo[actor.id];
        return (
          <a
            key={actor.id}
            onClick={(e) => {
              e.preventDefault();
              const ability = actorInfo.abilityId ? actor.items.get(actorInfo.abilityId) : undefined;
              if (ability) {
                ability.sheet?.render(true);
              } else {
                confirmADoodleDo({
                  message: "{ActorName} does not have {AbilityName}. Add it now?",
                  confirmText: "Yes please!",
                  cancelText: "No thanks",
                  confirmIconClass: "fa-check",
                  values: {
                    ActorName: actor.name ?? "",
                    AbilityName: abilityRowData.abilityDataSource.name,
                  },
                }).then(() => {
                  logger.log("OKAY");
                  const newAbility = Item.create(abilityRowData.abilityDataSource, { parent: actor });
                  return newAbility;
                }).then((newAbility) => {
                  if (newAbility) {
                    newAbility.sheet?.render(true);
                  }
                });
              }
            }}
            css={{
              background: bg,
              display: "block",
              gridRow: index + 2,
              gridColumn: j + 2,
              padding: "0.5em",
              textAlign: "center",
            }}
          >
            {actorInfo?.rating ?? "—"}
          </a>
        );
      })}

      {/* Total */}
      <div
        css={{
          background: headerBg,
          gridRow: index + 2,
          gridColumn: actors.length + 2,
          position: "sticky",
          right: 0,
          padding: "0.5em",
          textAlign: "center",
        }}
      >
        {abilityRowData.total}
      </div>
    </Fragment>
  ); //
};
