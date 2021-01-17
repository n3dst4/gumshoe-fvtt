/** @jsx jsx */
import { jsx } from "@emotion/react";
import React from "react";
import { useUpdate } from "../hooks/useUpdate";
import { TrailItem } from "../module/TrailItem";
import { FormField } from "./FormField";
type InvestigativeSkillSheetProps = {
  entity: TrailItem,
  foundryWindow: Application,
};

export const InvestigativeSkillSheet: React.FC<InvestigativeSkillSheetProps> = ({
  entity,
  foundryWindow,
}) => {
  const updateName = useUpdate(entity, (name) => ({ name }));

  return (
    <div>
      <h1>
        Investigative skill
      </h1>
      <FormField
        label="Name"
        value={entity.name}
        onChange={updateName}
      />
      <FormField
        label="Category"
        value={entity.name}
        onChange={updateName}
      />

      {/* "rating": 1,
        "pool": 1,
        "hasSpeciality": false,
        "speciality": "" */}

    </div>
  );
};
