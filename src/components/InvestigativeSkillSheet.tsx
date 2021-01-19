/** @jsx jsx */
import { jsx } from "@emotion/react";
import React from "react";
import { useUpdate } from "../hooks/useUpdate";
import { TrailItem } from "../module/TrailItem";
import { AsyncNumberInput } from "./AsyncNumberInput";
import { AsyncTextInput } from "./AsyncTextInput";
import { CSSReset } from "./CSSReset";
import { GridField } from "./GridField";
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
        <GridField label="Name">
          <AsyncTextInput value={entity.name} onChange={updateName} />
        </GridField>
        <GridField label="Category">
          <AsyncTextInput value={entity.data.data.category} onChange={updateCategory} />
        </GridField>
        <GridField label="Rating">
          <AsyncNumberInput value={entity.data.data.rating} onChange={updateRating} />
        </GridField>
        <GridField label="Pool">
          <AsyncNumberInput value={entity.data.data.pool} onChange={updatePool} />
        </GridField>
        <GridField label="Has speciality?">
          <input
            type="checkbox"
            checked={entity.data.data.hasSpeciality}
            onChange={(e) => {
              updateHasSpeciality(e.currentTarget.checked);
            }}
          />
        </GridField>
        {
          entity.data.data.hasSpeciality &&
          <GridField label="Speciality">
            <AsyncTextInput value={entity.data.data.speciality} onChange={updateSpeciality} />
          </GridField>
        }
      </InputGrid>
    </CSSReset>
  );
};
