/** @jsx jsx */
import { jsx } from "@emotion/react";
import React from "react";
import { TrailItem } from "../../module/TrailItem";
import { CSSReset } from "../CSSReset";
import { GridField } from "../inputs/GridField";
import { InputGrid } from "../inputs/InputGrid";
import { useAsyncUpdate } from "../../hooks/useAsyncUpdate";
import { TextInput } from "../inputs/TextInput";
import { TextArea } from "../inputs/TextArea";

type EquipmentSheetProps = {
  entity: TrailItem,
  foundryWindow: Application,
};

export const EquipmentSheet: React.FC<EquipmentSheetProps> = ({
  entity,
  foundryWindow,
}) => {
  const name = useAsyncUpdate(entity.name, entity.setName);
  const notes = useAsyncUpdate(entity.getter("notes")(), entity.setter("notes"));

  return (
    <CSSReset>
      <div>
        Equipment
      </div>

      <h1
        contentEditable
        onInput={name.onInput}
        onFocus={name.onFocus}
        onBlur={name.onBlur}
        ref={name.contentEditableRef}
      />
      <InputGrid>
      <GridField label="Name">
          <TextInput value={name.display} onChange={name.onChange} />
        </GridField>
        <GridField label="Notes">
          <TextArea value={notes.display} onChange={notes.onChange} />
        </GridField>
      </InputGrid>
    </CSSReset>
  );
};
