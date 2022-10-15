import { EquipmentFieldMetadata } from "@lumphammer/investigator-fvtt-types";
import React, { useCallback, useContext } from "react";
import { AsyncTextInput } from "../../inputs/AsyncTextInput";
import { Translate } from "../../Translate";
import { DispatchContext } from "../contexts";
import { slice } from "../reducer";

interface StringFieldSettingsProps {
  field: EquipmentFieldMetadata & { type: "string" };
  categoryId: string;
  fieldId: string;
}

export const StringFieldSettings: React.FC<StringFieldSettingsProps> = ({
  field,
  categoryId,
  fieldId,
}) => {
  const dispatch = useContext(DispatchContext);

  const handleChangeDefault = useCallback(
    (newDefault: string) => {
      dispatch(
        slice.creators.setFieldDefault({
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
      <AsyncTextInput
        css={{ flex: 1 }}
        value={field.default}
        onChange={handleChangeDefault}
      />
    </div>
  );
};

StringFieldSettings.displayName = "NumberFieldSettings";
