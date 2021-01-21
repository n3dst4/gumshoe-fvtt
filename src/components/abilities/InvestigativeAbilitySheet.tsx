/** @jsx jsx */
import { jsx } from "@emotion/react";
import React from "react";
import { useUpdate } from "../../hooks/useUpdate";
import { TrailItem } from "../../module/TrailItem";
import { AsyncNumberInput } from "../inputs/AsyncNumberInput";
import { AsyncTextInput } from "../inputs/AsyncTextInput";
import { CSSReset } from "../CSSReset";
import { GridField } from "../inputs/GridField";
import { InputGrid } from "../inputs/InputGrid";
type InvestigativeAbilitySheetProps = {
  entity: TrailItem,
  foundryWindow: Application,
};

export const InvestigativeAbilitySheet: React.FC<InvestigativeAbilitySheetProps> = ({
  entity,
  foundryWindow,
}) => {
  const updateName = useUpdate(entity, (name) => ({ name }));
  const updateCategory = useUpdate(entity, (category) => ({ data: { category } }));
  const updateRating = useUpdate(entity, (rating) => ({ data: { rating } }));
  const updatePool = useUpdate(entity, (pool) => ({ data: { pool } }));
  const updateHasSpeciality = useUpdate(entity, (hasSpeciality) => ({ name: entity.data.name, data: { hasSpeciality } }));
  const updateSpeciality = useUpdate(entity, (speciality) => ({ name: entity.data.name, data: { speciality } }));

  return (
    <CSSReset>
      <h1>
        Investigative ability
      </h1>
      <InputGrid>
        <GridField label="Name">
          <AsyncTextInput value={entity.data.name} onChange={updateName} />
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
