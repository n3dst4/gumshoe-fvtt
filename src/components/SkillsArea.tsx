/** @jsx jsx */
import { jsx } from "@emotion/react";
import React from "react";
import { GeneralSkill, InvestigativeSkill } from "../types";

type SkillsAreaProps = {
  investigativeSkills: { [category: string]: InvestigativeSkill[] },
  generalSkills: GeneralSkill[],
};

export const SkillsArea: React.FC<SkillsAreaProps> = ({
  investigativeSkills,
  generalSkills,
}) => {
  const i1Cats: string[] = [];
  const i2Cats: string[] = [];

  let i1Len = 0;
  let i2Len = 0;

  for (const cat of Object.keys(investigativeSkills)) {
    const col = i2Len < i1Len ? 2 : 1;

    (col === 1 ? i1Cats : i2Cats).push(cat);
    if (col === 1) {
      i1Len += investigativeSkills[cat].length;
    } else {
      i2Len += investigativeSkills[cat].length;
    }
  }

  return (
    <div
      css={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gridTemplateAreas: "'inv1 inv2 general'",
        gridTemplateRows: "auto",
      }}
    >
      <div css={{ gridArea: "general" }}>
        {generalSkills.map((skill) => (
          <div
            key={skill.id}
            onClick={() => {
              skill.sheet.render(true);
            }}
          >
            {skill.name}
          </div>
        ))}
      </div>
      <div css={{ gridArea: "inv1" }}>
        {i1Cats.map((cat) => (
          <div key={cat}>
            {cat}
          </div>
        ))}
      </div>
      <div css={{ gridArea: "inv2" }}>
        {i2Cats.map((cat) => (
          <div key={cat}>
            {cat}
          </div>
        ))}
      </div>
    </div>
  );
};
