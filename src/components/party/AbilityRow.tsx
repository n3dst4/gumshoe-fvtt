/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { Fragment } from "react";
import { GumshoeActor } from "../../module/GumshoeActor";
import { getDefaultThemeName } from "../../settingsHelpers";
import { themes } from "../../theme";
import { AbilityRowData } from "./types";

type AbilityRowProps = {
  data: AbilityRowData,
  index: number,
  actors: GumshoeActor[],
};

export const AbilityRow: React.FC<AbilityRowProps> = ({
  data,
  index,
  actors,
}) => {
  const theme = themes[getDefaultThemeName()] || themes.trailTheme;

  const zero = data.total === 0;
  const odd = index % 2 === 0;

  const bg = zero
    ? odd
        ? theme.colors.bgTransDangerPrimary
        : theme.colors.bgTransDangerSecondary
    : odd
      ? theme.colors.bgTransPrimary
      : theme.colors.bgTransSecondary;
  const headerBg = zero
    ? odd
        ? theme.colors.bgOpaqueDangerPrimary
        : theme.colors.bgOpaqueDangerSecondary
    : odd
      ? theme.colors.bgOpaquePrimary
      : theme.colors.bgOpaqueSecondary;
  return (
    <Fragment key={`${data.abilityType}$${data.name}`}>
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
      {actors.map((actor, j) => {
        const actorInfo = data.actorInfo[actor.id];
        return (
          <a
            key={actor.id}
            onClick={(e) => {
              e.preventDefault();
              actor.getOwnedItem(actorInfo.abilityId)?.sheet?.render(true);
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
