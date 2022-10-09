import { EquipmentFieldMetadata } from "@lumphammer/investigator-fvtt-types";
import React, { useCallback, useContext } from "react";
import { useRefStash } from "../../../hooks/useRefStash";
import { AsyncNumberInput } from "../../inputs/AsyncNumberInput";
import { Checkbox } from "../../inputs/Checkbox";
import { Translate } from "../../Translate";
import { DispatchContext } from "../contexts";
import { slice } from "../reducer";

interface NumberFieldSettingsProps {
  field: EquipmentFieldMetadata & { type: "number" };
  categoryIdx: number;
  fieldIdx: number;
}

export const NumberFieldSettings: React.FC<NumberFieldSettingsProps> = ({
  field,
  categoryIdx,
  fieldIdx,
}) => {
  const dispatch = useContext(DispatchContext);
  const fieldStash = useRefStash(field);

  const handleChangeDefault = useCallback(
    (newDefault: number) => {
      dispatch(
        slice.creators.setFieldDefault({
          categoryIdx,
          fieldIdx,
          newDefault,
        }),
      );
    },
    [categoryIdx, dispatch, fieldIdx],
  );

  const handleChangeMin = useCallback(
    (newMin: number) => {
      dispatch(
        slice.creators.setFieldMin({
          categoryIdx,
          fieldIdx,
          newMin,
        }),
      );
    },
    [categoryIdx, dispatch, fieldIdx],
  );

  const handleChangeMax = useCallback(
    (newMax: number) => {
      dispatch(
        slice.creators.setFieldMax({
          categoryIdx,
          fieldIdx,
          newMax,
        }),
      );
    },
    [categoryIdx, dispatch, fieldIdx],
  );

  const handleToggleMin = useCallback(
    (checked: boolean) => {
      const newMin = checked
        ? Math.min(fieldStash.current.default, fieldStash.current.max ?? 0)
        : undefined;
      dispatch(
        slice.creators.setFieldMin({
          categoryIdx,
          fieldIdx,
          newMin,
        }),
      );
    },
    [categoryIdx, dispatch, fieldIdx, fieldStash],
  );

  const handleToggleMax = useCallback(
    (checked: boolean) => {
      const newMax = checked
        ? Math.max(fieldStash.current.default, fieldStash.current.min ?? 0)
        : undefined;
      dispatch(
        slice.creators.setFieldMax({
          categoryIdx,
          fieldIdx,
          newMax,
        }),
      );
    },
    [categoryIdx, dispatch, fieldIdx, fieldStash],
  );

  return (
    <div
      css={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gridGap: "0.5rem",
        gridTemplateAreas: `
            "defaultLbl minLbl maxLbl"
            "default    min    max"
          `,
      }}
    >
      <div css={{ gridArea: "defaultLbl" }}>
        <Translate>Default</Translate>
      </div>
      <AsyncNumberInput
        css={{ gridArea: "default" }}
        value={field.default}
        onChange={handleChangeDefault}
      />
      <div css={{ gridArea: "minLbl" }}>
        <label>
          <Translate>Min</Translate>
          <Checkbox
            checked={field.min !== undefined}
            onChange={handleToggleMin}
          />
        </label>
      </div>
      {field.min !== undefined && (
        <AsyncNumberInput
          css={{ gridArea: "min" }}
          value={field.min}
          onChange={handleChangeMin}
        />
      )}
      <div css={{ gridArea: "maxLbl" }}>
        <label>
          <Translate>Max</Translate>
          <Checkbox
            checked={field.max !== undefined}
            onChange={handleToggleMax}
          />
        </label>
      </div>
      {field.max !== undefined && (
        <AsyncNumberInput
          css={{ gridArea: "max" }}
          value={field.max}
          onChange={handleChangeMax}
        />
      )}
    </div>
  );
};

NumberFieldSettings.displayName = "NumberFieldSettings";
