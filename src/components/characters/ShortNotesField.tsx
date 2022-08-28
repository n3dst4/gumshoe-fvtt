import React, { useCallback } from "react";
import { InvestigatorActor } from "../../module/InvestigatorActor";
import { isPCDataSource } from "../../types";
import { AsyncTextInput } from "../inputs/AsyncTextInput";
import { GridField } from "../inputs/GridField";

export const ShortNotesField: React.FC<{
  actor: InvestigatorActor,
  name: string,
  index: number,
}> = ({ actor, name, index }) => {
  const updateShortNote = useCallback(
    (value: string) => {
      actor.setShortNote(index, value);
    },
    [actor, index],
  );

  const value = isPCDataSource(actor.data)
    ? actor.data.data.shortNotes[index]
    : "";

  return (
    <GridField noTranslate label={name}>
      <AsyncTextInput value={value} onChange={updateShortNote} index={index} />
    </GridField>
  );
};

ShortNotesField.displayName = "ShortNotesField";
