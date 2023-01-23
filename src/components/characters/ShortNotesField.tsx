import React from "react";
import { InvestigatorActor } from "../../module/InvestigatorActor";
import { assertPersonalDetailDataSource } from "../../typeAssertions";
import { GridField } from "../inputs/GridField";
import { PersonalDetailSlug } from "./PersonalDetailSlug";
import { Slug } from "./Slug";

export const ShortNotesField: React.FC<{
  actor: InvestigatorActor;
  name: string;
  index: number;
}> = ({ actor, name, index }) => {
  const personalDetailItems = actor.getPersonalDetails().filter((item) => {
    assertPersonalDetailDataSource(item.data);
    return item.data.data.index === index;
  });

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
        <Slug
          onClick={() => {
            actor.createPersonalDetail(index); //
          }}
        >
          Add
        </Slug>
        // <AsyncTextInput
        //   value={value}
        //   onChange={updateShortNote}
        //   index={index}
        // />
      )}
    </GridField>
  );
};

ShortNotesField.displayName = "ShortNotesField";
