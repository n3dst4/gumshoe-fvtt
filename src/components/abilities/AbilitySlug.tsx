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
    <div
    key={ability.id}
    onClick={() => {
      ability.sheet.render(true);
    }}
  >
    {ability.name} ({ability.data.data.pool}/{ability.data.data.rating})
  </div>
  );
};
