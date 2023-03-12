import React, { useCallback } from "react";
import { InvestigatorActor } from "../../module/InvestigatorActor";
import { settings } from "../../settings";
import { assertPCDataSource } from "../../typeAssertions";
import { NoteWithFormat } from "../../types";
import { absoluteCover } from "../absoluteCover";
import { IndexedNotesEditorWithControls } from "../inputs/IndexedNotesEditorWithControls";
import { InputGrid } from "../inputs/InputGrid";

type NotesAreaProps = {
  actor: InvestigatorActor;
};

export const NotesArea: React.FC<NotesAreaProps> = ({ actor }) => {
  const longNotesNames = settings.longNotes.get();

  const updateLongNote = useCallback(
    (value: NoteWithFormat, index: number) => {
      actor.setLongNote(index, value);
    },
    [actor],
  );

  return (
    <div
      css={{
        ...absoluteCover,
        paddingTop: "1em",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {longNotesNames.map<JSX.Element>((name: string, i: number) => {
        assertPCDataSource(actor.data);
        return (
          <InputGrid key={`${name}--${i}`} css={{ flex: 1, minHeight: "12em" }}>
            <IndexedNotesEditorWithControls
              title={name}
              index={i}
              allowChangeFormat={false}
              format={actor.data.data.longNotesFormat}
              html={actor.data.data.longNotes[i]?.html ?? ""}
              source={actor.data.data.longNotes[i]?.source ?? ""}
              onSave={updateLongNote}
              h2
            />
          </InputGrid>
        );
      })}
    </div>
  );
};
