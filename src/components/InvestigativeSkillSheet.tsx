/** @jsx jsx */
import { jsx } from "@emotion/react";
import React from "react";
import { useUpdate } from "../hooks/useUpdate";
import { TrailItem } from "../module/TrailItem";
import { AsyncNumberInput } from "./AsyncNumberInput";
import { AsyncTextInput } from "./AsyncTextInput";
import { GridFormField } from "./GridFormField";
import { InputGrid } from "./InputGrid";
type InvestigativeSkillSheetProps = {
  entity: TrailItem,
  foundryWindow: Application,
};

export const InvestigativeSkillSheet: React.FC<InvestigativeSkillSheetProps> = ({
  entity,
  foundryWindow,
}) => {
  const updateName = useUpdate(entity, (name) => ({ name }));
  const updateCategory = useUpdate(entity, (name) => ({ data: { name } }));
  const updateRating = useUpdate(entity, (rating) => ({ data: { rating } }));
  const updatePool = useUpdate(entity, (pool) => ({ data: { pool } }));

  return (
    <div>
      <h1>
        Investigative skill
      </h1>
      <InputGrid>
        <GridFormField label="Name">
          <AsyncTextInput value={entity.name} onChange={updateName} />
        </GridFormField>
        <GridFormField label="Category">
          <AsyncTextInput value={entity.data.data.category} onChange={updateCategory} />
        </GridFormField>
        <GridFormField label="Rating">
          <AsyncNumberInput value={entity.data.data.rating} onChange={updateRating} />
        </GridFormField>
        <GridFormField label="Pool">
          <AsyncNumberInput value={entity.data.data.pool} onChange={updatePool} />
        </GridFormField>
        <GridFormField label="Pool">
          <AsyncNumberInput value={entity.data.data.pool} onChange={updatePool} />
        </GridFormField>
      </InputGrid>

      {/* "rating": 1,
        "pool": 1,
        "hasSpeciality": false,
        "speciality": "" */}

    </div>
  );
};
