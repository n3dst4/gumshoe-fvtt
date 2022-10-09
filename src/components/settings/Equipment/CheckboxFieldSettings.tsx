import { EquipmentFieldMetadata } from "@lumphammer/investigator-fvtt-types";
import React, { useCallback, useContext } from "react";
import { AsyncCheckbox } from "../../inputs/AsyncCheckbox";
import { Translate } from "../../Translate";
import { DispatchContext } from "../contexts";
import { slice } from "../reducer";

interface CheckboxFieldSettingsProps {
  field: EquipmentFieldMetadata & { type: "checkbox" };
  categoryIdx: number;
  fieldIdx: number;
}

export const CheckboxFieldSettings: React.FC<CheckboxFieldSettingsProps> = ({
  field,
  categoryIdx,
  fieldIdx,
}) => {
  const dispatch = useContext(DispatchContext);

  const handleChangeDefault = useCallback(
    (newDefault: boolean) => {
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

  return (
    <div
      css={{
        display: "flex",
      }}
    >
      <div css={{ flex: 0, paddingRight: "1em" }}>
        <Translate>Default</Translate>
      </div>
      <AsyncCheckbox
        css={{ flex: 1 }}
        checked={field.default}
        onChange={handleChangeDefault}
      />
    </div>
  );
};

CheckboxFieldSettings.displayName = "CheckboxFieldSettings";
