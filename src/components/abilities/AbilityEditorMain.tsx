/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useCallback } from "react";
import { useUpdate } from "../../hooks/useUpdate";
import { TrailItem } from "../../module/TrailItem";
import { AsyncTextInput } from "../inputs/AsyncTextInput";
import { GridField } from "../inputs/GridField";
import { InputGrid } from "../inputs/InputGrid";
import { AsyncNumberInput } from "../inputs/AsyncNumberInput";
import { GridFieldStacked } from "../inputs/GridFieldStacked";

type AbilityEditorMainProps = {
  ability: TrailItem,
};

export const AbilityEditorMain: React.FC<AbilityEditorMainProps> = ({
  ability,
}) => {
  const updateRating = useUpdate(ability, (rating) => ({ data: { rating } }));
  const updatePool = useUpdate(ability, (pool) => ({ data: { pool } }));
  const updateSpeciality = useUpdate(ability, (speciality) => ({ data: { speciality } }));

  const onClickRefresh = useCallback(() => {
    ability.refreshPool();
  }, [ability]);

  return (
    <InputGrid>
      <GridField label="Rating">
        <AsyncNumberInput
          min={0}
          value={ability.data.data.rating}
          onChange={updateRating}
        />
      </GridField>
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
      <GridFieldStacked label="Specialities">
        <div
          css={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <AsyncTextInput
            value={ability.data.data.speciality}
            onChange={updateSpeciality}
            disabled={!ability.data.data.hasSpeciality}
            placeholder="Enter a comma-separated list of specialities"
            css={{
              opacity: ability.data.data.hasSpeciality ? 1 : 0,
              transition: "opacity 0.5s",
            }}
          />
        </div>
      </GridFieldStacked>
    </InputGrid>
  );
};
