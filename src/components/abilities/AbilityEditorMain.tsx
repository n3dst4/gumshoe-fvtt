/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useCallback } from "react";
import { useUpdate } from "../../hooks/useUpdate";
import { TrailItem } from "../../module/TrailItem";
import { GridField } from "../inputs/GridField";
import { InputGrid } from "../inputs/InputGrid";
import { AsyncNumberInput } from "../inputs/AsyncNumberInput";
import { GridFieldStacked } from "../inputs/GridFieldStacked";
import { SpecialityList } from "./SpecialityList";

type AbilityEditorMainProps = {
  ability: TrailItem,
};

export const AbilityEditorMain: React.FC<AbilityEditorMainProps> = ({
  ability,
}) => {
  const updateRating = useCallback((rating) => {
    ability.setRating(rating);
  }, [ability]);
  const updatePool = useUpdate(ability, (pool) => ({ data: { pool } }));

  const onClickRefresh = useCallback(() => {
    ability.refreshPool();
  }, [ability]);

  return (
    <InputGrid>
      <GridField label="Pool">
        <div
          css={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <AsyncNumberInput
            min={0}
            max={ability.data.data.rating}
            value={ability.data.data.pool}
            onChange={updatePool}
            css={{
              flex: 1,
            }}
          />
          <button
            css={{
              flexBasis: "min-content",
              flex: 0,
              lineHeight: "inherit",
            }}
            onClick={onClickRefresh}
          >
            Refresh
          </button>
        </div>
      </GridField>
      <GridField label="Rating">
        <AsyncNumberInput
          min={0}
          value={ability.data.data.rating}
          onChange={updateRating}
        />
      </GridField>
      {ability.getHasSpeciality() &&
        <GridFieldStacked label={ability.getSpecialities().length === 1 ? "Speciality" : "Specialities"}>
          <div
            css={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <SpecialityList ability={ability} />
          </div>
        </GridFieldStacked>
      }
    </InputGrid>
  );
};
