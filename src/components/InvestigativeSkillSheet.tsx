/** @jsx jsx */
import { jsx } from "@emotion/react";
import React from "react";
import { useUpdate } from "../hooks/useUpdate";
import { TrailItem } from "../module/TrailItem";
import { AsyncNumberInput } from "./AsyncNumberInput";
import { AsyncTextInput } from "./AsyncTextInput";
import { CSSReset } from "./CSSReset";
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
  const updateCategory = useUpdate(entity, (category) => ({ data: { category } }));
  const updateRating = useUpdate(entity, (rating) => ({ data: { rating } }));
  const updatePool = useUpdate(entity, (pool) => ({ data: { pool } }));
  const updateHasSpeciality = useUpdate(entity, (hasSpeciality) => ({ data: { hasSpeciality } }));
  const updateSpeciality = useUpdate(entity, (speciality) => ({ data: { speciality } }));

  return (
    <CSSReset>
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
        <GridFormField label="Has speciality?">
          <input
            type="checkbox"
            checked={entity.data.data.hasSpeciality}
            onChange={(e) => {
              updateHasSpeciality(e.currentTarget.checked);
            }}
          />
        </GridFormField>
        {
          entity.data.data.hasSpeciality &&
          <GridFormField label="Speciality">
            <AsyncTextInput value={entity.data.data.speciality} onChange={updateSpeciality} />
          </GridFormField>
        }
      </InputGrid>
    </CSSReset>
  );
};
