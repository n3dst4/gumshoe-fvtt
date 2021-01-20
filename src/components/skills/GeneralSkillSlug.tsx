/** @jsx jsx */
import React from "react";
import { jsx } from "@emotion/react";
import { TrailItem } from "../../module/TrailItem";

type GeneralSkillSlugProps = {
  skill: TrailItem,
};

export const GeneralSkillSlug: React.FC<GeneralSkillSlugProps> = ({
  skill,
}) => {
  return (
    <div
    key={skill.id}
    onClick={() => {
      skill.sheet.render(true);
    }}
  >
    {skill.name} ({skill.data.data.pool}/{skill.data.data.rating})
  </div>
  );
};
