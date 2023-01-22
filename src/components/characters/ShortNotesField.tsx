import React, { useCallback } from "react";
import { InvestigatorActor } from "../../module/InvestigatorActor";
import {
  assertPersonalDetailDataSource,
  isPCDataSource,
} from "../../typeAssertions";
import { AsyncTextInput } from "../inputs/AsyncTextInput";
import { GridField } from "../inputs/GridField";
import { PersonalDetailSlug } from "./PersonalDetailSlug";

export const ShortNotesField: React.FC<{
  actor: InvestigatorActor;
  name: string;
  index: number;
}> = ({ actor, name, index }) => {
  const personalDetailItems = actor.getPersonalDetails().filter((item) => {
    assertPersonalDetailDataSource(item.data);
    return item.data.data.index === index;
  });

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
    <GridField
      noTranslate
      label={name}
      css={{
        position: "relative",
      }}
    >
      {personalDetailItems.map((item) => (
        <PersonalDetailSlug key={item.id} item={item} />
      ))}
      {personalDetailItems.length === 0 && (
        <AsyncTextInput
          value={value}
          onChange={updateShortNote}
          index={index}
        />
      )}
    </GridField>
  );
};

ShortNotesField.displayName = "ShortNotesField";
