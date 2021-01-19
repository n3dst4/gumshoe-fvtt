/** @jsx jsx */
import React from "react";
import { jsx } from "@emotion/react";
import { TrailItem } from "../../module/TrailItem";
import { GeneralSkillRollClass } from "../../module/GeneralSkillRollClass";

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
      const rollApp = new GeneralSkillRollClass(skill, {});
      rollApp.render(true);
      // skill.sheet.render(true);
    }}
  >
    {skill.name} ({skill.data.data.pool}/{skill.data.data.rating})
  </div>
  );
};
