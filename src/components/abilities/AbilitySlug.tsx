/** @jsx jsx */
import React from "react";
import { jsx } from "@emotion/react";
import { TrailItem } from "../../module/TrailItem";

type AbilitySlugProps = {
  ability: TrailItem,
};

export const AbilitySlug: React.FC<AbilitySlugProps> = ({
  ability,
}) => {
  return (
    <a
      key={ability.id}
      css={{
        display: "block",
        ":hover": {
          textShadow: "0 0 0.5em #ec6f12",
        },
      }}
      onClick={() => {
        ability.sheet.render(true);
      }}
    >
      {ability.name} ({ability.data.data.pool}/{ability.data.data.rating})
    </a>
  );
};
