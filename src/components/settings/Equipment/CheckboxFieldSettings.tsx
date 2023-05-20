import { EquipmentFieldMetadata } from "@lumphammer/investigator-fvtt-types";
import React, { useCallback, useContext } from "react";
import { AsyncCheckbox } from "../../inputs/AsyncCheckbox";
import { Translate } from "../../Translate";
import { DispatchContext } from "../contexts";
import { store } from "../store";

interface CheckboxFieldSettingsProps {
  field: EquipmentFieldMetadata & { type: "checkbox" };
  categoryId: string;
  fieldId: string;
}

export const CheckboxFieldSettings: React.FC<CheckboxFieldSettingsProps> = ({
  field,
  categoryId,
  fieldId,
}) => {
  const dispatch = useContext(DispatchContext);

  const handleChangeDefault = useCallback(
    (newDefault: boolean) => {
      dispatch(
        store.creators.setFieldDefault({
          categoryId,
          fieldId,
          newDefault,
        }),
      );
    },
    [categoryId, dispatch, fieldId],
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
