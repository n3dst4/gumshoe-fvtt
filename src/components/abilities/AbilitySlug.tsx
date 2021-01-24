/** @jsx jsx */
import React from "react";
import { jsx } from "@emotion/react";
import { TrailItem } from "../../module/TrailItem";

type AbilitySlugProps = {
  ability: TrailItem;
};

export const AbilitySlug: React.FC<AbilitySlugProps> = ({ ability }) => {
  return (
    <a
      key={ability.id}
      css={{
        display: "block",
        position: "relative",
        ":hover": {
          textShadow: "0 0 0.5em #ec6f12",
        },
      }}
      onClick={() => {
        ability.sheet.render(true);
      }}
    >
      <div>
        {ability.name} ({ability.data.data.pool}/{ability.data.data.rating})
      </div>
      {ability.data.data.hasSpecialities && (
        <div css={{ paddingLeft: "1em" }}>
          {(ability.data.data.specialities || []).map((x, i) => (
            <div key={i}>{x.trim()}</div>
          ))}
        </div>
      )}
      {ability.data.data.occupational &&
        <i
          className="fa fa-star-of-life"
          css={{
            position: "absolute",
            right: "100%",
            top: 0,

          }}
        />
      }
    </a>
  );
};
