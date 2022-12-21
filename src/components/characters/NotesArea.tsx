import React, { useCallback } from "react";
import { InvestigatorActor } from "../../module/InvestigatorActor";
import { settings } from "../../settings";
import { assertPCDataSource } from "../../typeAssertions";
import { absoluteCover } from "../absoluteCover";
import { InputGrid } from "../inputs/InputGrid";
import { NotesEditorWithControls } from "../inputs/NotesEditorWithControls";

type NotesAreaProps = {
  actor: InvestigatorActor,
};

export const NotesArea: React.FC<NotesAreaProps> = ({
  actor,
}) => {
  const longNotesNames = settings.longNotes.get();

  const updateLongNote = useCallback((value, index) => {
    actor.setLongNote(index, value);
  }, [actor]);

  return (
    <div
      css={{
        ...absoluteCover,
        paddingTop: "1em",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {
        longNotesNames.map<JSX.Element>((name: string, i: number) => {
          assertPCDataSource(actor.data);
          return (
            <InputGrid key={`${name}--${i}`} css={{ flex: 1, minHeight: "12em" }}>
              <NotesEditorWithControls
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
        })
      }
    </div>
  );
};
