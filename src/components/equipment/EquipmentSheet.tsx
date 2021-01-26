/** @jsx jsx */
import { jsx } from "@emotion/react";
import React from "react";
import { TrailItem } from "../../module/TrailItem";
import { AsyncTextInput } from "../inputs/AsyncTextInput";
import { CSSReset } from "../CSSReset";
import { GridField } from "../inputs/GridField";
import { InputGrid } from "../inputs/InputGrid";
import { useAsyncUpdate } from "../../hooks/useAsyncUpdate";

type EquipmentSheetProps = {
  entity: TrailItem,
  foundryWindow: Application,
};

export const EquipmentSheet: React.FC<EquipmentSheetProps> = ({
  entity,
  foundryWindow,
}) => {
  const name = useAsyncUpdate(entity.name, entity.setName);

  return (
    <CSSReset>
      <h1
        contentEditable
        onInput={name.onInput}
        onFocus={name.onFocus}
        onBlur={name.onBlur}
        ref={name.contentEditableRef}
      >
        {name.display}
      </h1>
      <InputGrid>
        <GridField label="Name">
          <AsyncTextInput value={name.display} onChange={name.onChange} />
        </GridField>
      </InputGrid>
    </CSSReset>
  );
};
