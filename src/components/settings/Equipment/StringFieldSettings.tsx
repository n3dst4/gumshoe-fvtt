import { EquipmentFieldMetadata } from "@lumphammer/investigator-fvtt-types";
import React, { useCallback, useContext } from "react";
import { AsyncTextInput } from "../../inputs/AsyncTextInput";
import { Translate } from "../../Translate";
import { DispatchContext } from "../contexts";
import { slice } from "../reducer";

interface StringFieldSettingsProps {
  field: EquipmentFieldMetadata & { type: "string" };
  categoryIdx: number;
  fieldIdx: number;
}

export const StringFieldSettings: React.FC<StringFieldSettingsProps> = ({
  field,
  categoryIdx,
  fieldIdx,
}) => {
  const dispatch = useContext(DispatchContext);

  const handleChangeDefault = useCallback(
    (newDefault: string) => {
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
      <div css={{ flex: 0 }}>
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
