/** @jsx jsx */
import { jsx } from "@emotion/react";
import React from "react";
import { useUpdate } from "../hooks/useUpdate";
import { TrailItem } from "../module/TrailItem";
import { AsyncTextInput } from "./AsyncTextInput";
import { CSSReset } from "./CSSReset";
import { GridFormField } from "./GridFormField";
import { InputGrid } from "./InputGrid";
type EquipmentSheetProps = {
  entity: TrailItem,
  foundryWindow: Application,
};

export const EquipmentSheet: React.FC<EquipmentSheetProps> = ({
  entity,
  foundryWindow,
}) => {
  const updateName = useUpdate(entity, (name) => ({ name }));

  return (
    <CSSReset>
      <h1>
        Equipment
      </h1>
      <InputGrid>
        <GridFormField label="Name">
          <AsyncTextInput value={entity.name} onChange={updateName} />
        </GridFormField>
      </InputGrid>
    </CSSReset>
  );
};
