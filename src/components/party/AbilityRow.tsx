/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { Fragment } from "react";
import { InvestigatorActor } from "../../module/InvestigatorActor";
import { getDefaultThemeName } from "../../settingsHelpers";
import { themes } from "../../themes/themes";
import { AbilityRowData } from "./types";

type AbilityRowProps = {
  data: AbilityRowData,
  index: number,
  actors: InvestigatorActor[],
};

export const AbilityRow: React.FC<AbilityRowProps> = ({
  data,
  index,
  actors,
}) => {
  const theme = themes[getDefaultThemeName()] || themes.tealTheme;

  const zero = data.total === 0;
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
        {data.name}
      </div>

      {/* Ability scores */}
      {actors.map<JSX.Element|null>((actor, j) => {
        if (actor === undefined || actor.id === null) {
          return null;
        }
        const actorInfo = data.actorInfo[actor.id];
        return (
          <a
            key={actor.id}
            onClick={(e) => {
              e.preventDefault();
              actor.items.get(actorInfo.abilityId)?.sheet?.render(true);
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
        {data.total}
      </div>
    </Fragment>
  ); //
};
